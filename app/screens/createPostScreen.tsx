import { BASE_URL } from "@/env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function CreatePostScreen() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const [flash, setFlash] = useState<{
    type: "success" | "error";
    title?: string;
    message?: string;
  } | null>(null);

  const params = useLocalSearchParams<{
    flashType?: "success" | "error";
    flashTitle?: string;
    flashMessage?: string;

    mode?: string;
    id?: string;
    title?: string;
    content?: string;
    imageUrl?: string;
    images?: string;
  }>();

  const {
    flashType,
    flashTitle,
    flashMessage,
    mode,
    id: postIdParam,
    title: initialTitleParam,
    content: initialContentParam,
    imageUrl: initialImageUrlParam,
    images: imagesParam,
  } = params;

  const isEditing = mode === "edit" && !!postIdParam;

  useEffect(() => {
    if (flashType || flashTitle || flashMessage) {
      setFlash({
        type: (flashType as any) || "success",
        title: flashTitle,
        message: flashMessage,
      });
    }
  }, [flashType, flashTitle, flashMessage]);

  // Preencher campos quando vier em modo edição
  useEffect(() => {
    if (isEditing) {
      if (initialTitleParam) setTitle(String(initialTitleParam));
      if (initialContentParam) setContent(String(initialContentParam));
      if (initialImageUrlParam) setImageUrl(String(initialImageUrlParam));

      if (imagesParam) {
        try {
          const parsed = JSON.parse(String(imagesParam));
          if (Array.isArray(parsed)) {
            setImages(parsed);
          }
        } catch (e) {
          console.warn("Falha ao parsear imagesParam:", e);
        }
      }
    }
  }, [
    isEditing,
    initialTitleParam,
    initialContentParam,
    initialImageUrlParam,
    imagesParam,
  ]);

  async function requestGalleryPermission(): Promise<boolean> {
    try {
      const { status: existingStatus } = await ImagePicker.getMediaLibraryPermissionsAsync();
      
      if (existingStatus === 'granted') {
        return true;
      }

      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          "Permissão necessária",
          "Precisamos de acesso à sua galeria para você adicionar imagens aos posts. Por favor, habilite nas configurações do dispositivo.",
          [{ text: "OK" }]
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error("Erro ao solicitar permissão:", error);
      return false;
    }
  }

  async function uploadImageToBackend(localUri: string): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Erro", "Você precisa estar logado para fazer upload de imagens.");
        return null;
      }

      // Converter URI local para base64
      const response = await fetch(localUri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          try {
            const base64String = reader.result as string;
            
            // Enviar para o backend
            const uploadResponse = await fetch(`${BASE_URL}/feed/upload-image`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ image: base64String }),
            });

            if (!uploadResponse.ok) {
              throw new Error("Falha no upload da imagem");
            }

            const data = await uploadResponse.json();
            console.log("Upload response:", data);
            
            if (!data.imageUrl) {
              throw new Error("Backend não retornou imageUrl");
            }
            
            resolve(data.imageUrl); // URL em Base64 retornada pelo backend
          } catch (error) {
            console.error("Erro no upload:", error);
            reject(error);
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      Alert.alert("Erro", "Não foi possível fazer upload da imagem.");
      return null;
    }
  }

  async function pickImage() {
    try {
      const hasPermission = await requestGalleryPermission();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setUploadingImage(true);
        
        // Mostrar preview com URI local temporariamente
        const localUri = result.assets[0].uri;
        setImageUrl(localUri);
        
        // Fazer upload e substituir por Base64
        const base64Url = await uploadImageToBackend(localUri);
        console.log("Base64 URL recebida:", base64Url);
        
        if (base64Url) {
          setImageUrl(base64Url);
          console.log("Imagem principal atualizada com Base64");
        } else {
          setImageUrl(""); // Limpar se falhar
          Alert.alert("Aviso", "Falha ao fazer upload da imagem principal");
        }
        
        setUploadingImage(false);
      }
    } catch (error) {
      setUploadingImage(false);
      Alert.alert("Erro", "Não foi possível selecionar a imagem.");
    }
  }

  async function pickMultipleImages() {
    try {
      const hasPermission = await requestGalleryPermission();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        setUploadingImage(true);
        
        const localUris = result.assets.map((asset: any) => asset.uri);
        
        // Mostrar preview com URIs locais temporariamente
        setImages(localUris);
        
        // Fazer upload de todas as imagens e substituir por Base64
        const uploadPromises = localUris.map(uri => uploadImageToBackend(uri));
        const base64Urls = await Promise.all(uploadPromises);
        
        // Filtrar apenas as que tiveram sucesso
        const validUrls = base64Urls.filter(url => url !== null) as string[];
        setImages(validUrls);
        
        setUploadingImage(false);
      }
    } catch (error) {
      setUploadingImage(false);
      Alert.alert("Erro", "Não foi possível selecionar as imagens.");
    }
  }

  function removeMainImage() {
    setImageUrl("");
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleCreatePost() {
    if (!title || !content) {
      Alert.alert("Erro", "Preencha o título e o conteúdo do post.");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        Alert.alert(
          "Erro",
          "Você precisa estar logado para criar/editar um post."
        );
        router.replace("/login");
        return;
      }

      const postData: any = { title, content };
      if (imageUrl) postData.imageUrl = imageUrl;
      if (images.length > 0) postData.images = images;

      console.log("Enviando post com dados:", {
        ...postData,
        imageUrl: imageUrl ? `${imageUrl.substring(0, 50)}...` : null,
        imagesCount: images.length
      });

      const url = isEditing
        ? `${BASE_URL}/feed/${postIdParam}`
        : `${BASE_URL}/feed`;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const raw = await response.text();
        let msg: any = isEditing
          ? "Falha ao atualizar post"
          : "Falha ao criar post";
        try {
          const data = raw ? JSON.parse(raw) : {};
          msg = data?.message || data?.error || raw || msg;
          if (Array.isArray(msg)) msg = msg[0];
        } catch {}
        throw new Error(typeof msg === "string" ? msg : "Falha ao salvar post");
      }

      await response.json();

      // Limpar campos
      setTitle("");
      setContent("");
      setImageUrl("");
      setImages([]);

      // Redirecionar para a home com mensagem de sucesso
      router.replace({
        pathname: "/(tabs)",
        params: {
          flashType: "success",
          flashTitle: isEditing ? "Post atualizado!" : "Post criado!",
          flashMessage: isEditing
            ? "Seu post foi atualizado com sucesso."
            : "Seu post foi publicado com sucesso.",
          refresh: Date.now().toString(), // Força atualização dos posts
        },
      });
    } catch (err: any) {
      Alert.alert(
        "Erro",
        err?.message ||
          (isEditing ? "Falha ao atualizar post" : "Falha ao criar post")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Image
            source={require("../images/logo.jpeg")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>
            {isEditing ? "Editar Post" : "Criar Post"}
          </Text>

          {!!flash && (
            <View
              style={[
                styles.flashBox,
                flash.type === "success"
                  ? styles.flashSuccess
                  : styles.flashError,
              ]}
            >
              {!!flash.title && (
                <Text style={styles.flashTitle}>{flash.title}</Text>
              )}
              {!!flash.message && (
                <Text style={styles.flashText}>{flash.message}</Text>
              )}
              <TouchableOpacity
                style={styles.flashClose}
                onPress={() => setFlash(null)}
              >
                <Text style={styles.flashCloseText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          )}

          <TextInput
            style={styles.input}
            placeholder="Título do post"
            value={title}
            onChangeText={setTitle}
            autoCapitalize="sentences"
            editable={!loading}
            returnKeyType="next"
          />

          <TextInput
            style={[styles.input, styles.contentInput]}
            placeholder="Conteúdo do post"
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            editable={!loading}
            returnKeyType="done"
          />

          {/* Seção de Upload de Imagens */}
          <View style={styles.imageSection}>
            <Text style={styles.sectionLabel}>Imagens (Opcional)</Text>

            {/* Indicador de Upload */}
            {uploadingImage && (
              <View style={styles.uploadingIndicator}>
                <ActivityIndicator size="small" color="#0EA5E9" />
                <Text style={styles.uploadingText}>Fazendo upload...</Text>
              </View>
            )}

            {/* Botões de Upload */}
            <View style={styles.uploadButtons}>
              <TouchableOpacity
                style={[styles.uploadBtn, uploadingImage && { opacity: 0.5 }]}
                onPress={pickImage}
                disabled={loading || uploadingImage}
              >
                <Text style={styles.uploadBtnText}>📷 Imagem Principal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.uploadBtn, uploadingImage && { opacity: 0.5 }]}
                onPress={pickMultipleImages}
                disabled={loading || uploadingImage}
              >
                <Text style={styles.uploadBtnText}>🖼️ Múltiplas Imagens</Text>
              </TouchableOpacity>
            </View>

            {/* Preview da Imagem Principal */}
            {imageUrl ? (
              <View style={styles.imagePreview}>
                <Text style={styles.previewLabel}>Imagem Principal:</Text>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: imageUrl }}
                    style={styles.mainImage}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={removeMainImage}
                  >
                    <Text style={styles.removeBtnText}>❌</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}

            {/* Preview das Múltiplas Imagens */}
            {images.length > 0 ? (
              <View style={styles.imagePreview}>
                <Text style={styles.previewLabel}>
                  Galeria ({images.length}{" "}
                  {images.length === 1 ? "imagem" : "imagens"}):
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.imageGallery}
                >
                  {images.map((uri, index) => (
                    <View key={index} style={styles.galleryItem}>
                      <Image
                        source={{ uri }}
                        style={styles.galleryImage}
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        style={styles.removeBtn}
                        onPress={() => removeImage(index)}
                      >
                        <Text style={styles.removeBtnText}>❌</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>
            ) : null}
          </View>

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handleCreatePost}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {isEditing ? "Salvar alterações" : "Publicar Post"}
              </Text>
            )}
          </TouchableOpacity>

          <Stack.Screen options={{ headerShown: false }} />

          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.link}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  content: {
    flexGrow: 1,
    maxWidth: 520,
    width: "100%",
    alignSelf: "center",
    alignItems: "stretch",
  },
  logo: { width: "100%", height: undefined, aspectRatio: 3, marginBottom: 8 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 0,
    textAlign: "center",
  },
  flashBox: {
    width: "100%",
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  flashSuccess: { borderColor: "#b3ffd4", backgroundColor: "#e6fff1" },
  flashError: { borderColor: "#ffb3b3", backgroundColor: "#ffe6e6" },
  flashTitle: { fontWeight: "700", marginBottom: 4 },
  flashText: { color: "#2d2d2d" },
  flashClose: { alignSelf: "flex-end", marginTop: 6 },
  flashCloseText: { color: "#007bff", fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    width: "100%",
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  contentInput: {
    minHeight: 120,
    paddingTop: 12,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    marginTop: 12,
    width: "100%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  link: { color: "#007bff", textAlign: "center", marginTop: 10 },

  // Estilos para upload de imagens
  imageSection: {
    marginTop: 8,
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2d2d2d",
    marginBottom: 8,
  },
  uploadingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    backgroundColor: "#E0F2FE",
    borderRadius: 8,
    marginBottom: 12,
  },
  uploadingText: {
    fontSize: 14,
    color: "#0EA5E9",
    fontWeight: "600",
  },
  uploadButtons: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  uploadBtn: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  uploadBtnText: {
    color: "#007bff",
    fontWeight: "600",
    fontSize: 13,
  },
  imagePreview: {
    marginTop: 12,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
  },
  imageContainer: {
    position: "relative",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  mainImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#f5f5f5",
  },
  removeBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  removeBtnText: {
    fontSize: 16,
  },
  imageGallery: {
    flexDirection: "row",
  },
  galleryItem: {
    position: "relative",
    marginRight: 8,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  galleryImage: {
    width: 120,
    height: 120,
    backgroundColor: "#f5f5f5",
  },
});
