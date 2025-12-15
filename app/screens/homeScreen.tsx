import { BASE_URL } from "@/env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert, // ✅ ADICIONADO
  FlatList,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput, // ✅ ADICIONADO
  TouchableOpacity,
  View,
} from "react-native";

type Post = {
  id: string;
  title: string;
  content: string;
  userName: string;
  userRole?: string;
  createdAt?: string;
  tags?: string[];
  type?: string;
  author?: { name?: string; role?: string };
  imageUrl?: string;
  images?: string[];
  edit?: boolean; // 👈 vem do back
  likesCount?: number;
  hasLiked?: boolean;

  // ✅ ADICIONADO (se o backend mandar, aparece; se não, fica 0)
  commentsCount?: number;
};

// ✅ ADICIONADO: tipo do comentário
type Comment = {
  id: string;
  feedId: string;
  userId: string;
  userName?: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  edit?: boolean;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [flash, setFlash] = useState<{
    type: "success" | "error";
    title?: string;
    message?: string;
  } | null>(null);

  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>(
    {}
  );

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set());

  // ✅ ADICIONADO: estados do modal de comentários
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentsPostId, setCommentsPostId] = useState<string | null>(null);
  const [commentsPostTitle, setCommentsPostTitle] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [sendingComment, setSendingComment] = useState(false);

  const { flashType, flashTitle, flashMessage, refresh } =
    useLocalSearchParams<{
      flashType?: "success" | "error";
      flashTitle?: string;
      flashMessage?: string;
      refresh?: string;
    }>();

  useEffect(() => {
    if (flashType || flashTitle || flashMessage) {
      setFlash({
        type: (flashType as any) || "success",
        title: flashTitle,
        message: flashMessage,
      });

      const timer = setTimeout(() => setFlash(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [flashType, flashTitle, flashMessage]);

  const fetchFeed = useCallback(async () => {
    try {
      setError(null);
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setPosts([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const res = await fetch(`${BASE_URL}/feed?page=1&limit=20`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      const json = await res.json();
      const postsData = Array.isArray(json?.data) ? json.data : [];

      console.log("Posts recebidos:", postsData.length, "posts");
      console.log("Verificando imagens nos posts:");
      postsData.forEach((p: any) => {
        if (p.imageUrl || p.images?.length) {
          console.log(`Post ID ${p.id}:`, {
            hasImageUrl: !!p.imageUrl,
            imageUrlPreview: p.imageUrl ? p.imageUrl.substring(0, 100) : null,
            imagesCount: p.images?.length || 0,
          });
        }
      });

      setPosts(postsData);
    } catch (e: any) {
      setError(e?.message ?? "Falha ao carregar o feed");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let alive = true;

      (async () => {
        const token = await AsyncStorage.getItem("userToken");

        if (!alive) return;

        if (!token) {
          router.replace("/");
          return;
        }

        setLoading(true);
        await fetchFeed();
      })();

      return () => {
        alive = false;
      };
    }, [fetchFeed])
  );

  useEffect(() => {
    if (refresh) {
      setLoading(true);
      fetchFeed();
    }
  }, [refresh, fetchFeed]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFeed();
  }, [fetchFeed]);

  const handleOpenProfile = () => setProfileOpen(true);
  const handleCloseProfile = () => setProfileOpen(false);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      setPosts([]);
      setExpandedPosts({});
      setConfirmDeleteId(null);
      setProfileOpen(false);

      router.replace("/(tabs)/login");
    } catch (err) {
      console.error("Erro ao deslogar:", err);
    }
  };

  const goEditProfile = () => {
    setProfileOpen(false);
    router.push("/(tabs)/edit-profile");
  };

  const renderTag = (t: string, idx: number) => (
    <View key={`${t}-${idx}`} style={styles.tag}>
      <Text style={styles.tagText}>#{t}</Text>
    </View>
  );

  const toggleExpand = (postId: string) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleAskDelete = (postId: string) => {
    setConfirmDeleteId(postId);
  };

  const handleConfirmDelete = async (postId: string) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setFlash({
          type: "error",
          title: "Erro",
          message: "Você precisa estar logado para excluir um post.",
        });
        setConfirmDeleteId(null);
        return;
      }

      const url = `${BASE_URL}/feed/${postId}`;
      console.log("DELETE URL:", url);

      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const raw = await res.text();
      console.log("Status DELETE:", res.status);
      console.log("Resposta DELETE:", raw);

      if (!res.ok) {
        let msg: any = "Falha ao excluir post";
        try {
          const data = raw ? JSON.parse(raw) : {};
          msg = data?.message || data?.error || raw || msg;
          if (Array.isArray(msg)) msg = msg[0];
        } catch (e) {}

        throw new Error(
          typeof msg === "string" ? msg : "Falha ao excluir post"
        );
      }

      setPosts((prev) => prev.filter((post) => post.id !== postId));
      setConfirmDeleteId(null);

      setFlash({
        type: "success",
        title: "Post excluído",
        message: "Publicação excluída com sucesso.",
      });
    } catch (err: any) {
      console.log("Erro ao excluir:", err);
      setConfirmDeleteId(null);
      setFlash({
        type: "error",
        title: "Erro ao excluir",
        message: err?.message || "Falha ao excluir publicação.",
      });
    }
  };

  const handleLike = async (postId: string) => {
    console.log("like");
    if (likingPosts.has(postId)) {
      return;
    }

    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setFlash({
          type: "error",
          title: "Erro",
          message: "Você precisa estar logado para curtir posts.",
        });
        return;
      }

      setLikingPosts((prev) => new Set(prev).add(postId));

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            const wasLiked = post.hasLiked;
            return {
              ...post,
              hasLiked: !wasLiked,
              likesCount: wasLiked
                ? (post.likesCount || 0) - 1
                : (post.likesCount || 0) + 1,
            };
          }
          return post;
        })
      );

      const response = await fetch(`${BASE_URL}/feed/${postId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response);

      if (!response.ok) {
        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post.id === postId) {
              const wasLiked = post.hasLiked;
              return {
                ...post,
                hasLiked: !wasLiked,
                likesCount: wasLiked
                  ? (post.likesCount || 0) + 1
                  : (post.likesCount || 0) - 1,
              };
            }
            return post;
          })
        );

        throw new Error("Falha ao curtir post");
      }

      const data = await response.json();
      console.log("Like response:", data);
    } catch (err: any) {
      console.error("Erro ao curtir post:", err);
      setFlash({
        type: "error",
        title: "Erro",
        message: err?.message || "Não foi possível curtir o post.",
      });
    } finally {
      setLikingPosts((prev) => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
    }
  };

  // ✅ ADICIONADO: comentários (open, close, fetch, send)
  const openComments = async (post: Post) => {
    setCommentsPostId(post.id);
    setCommentsPostTitle(post.title);
    setCommentsOpen(true);
    setCommentText("");
    await fetchComments(post.id);
  };

  const closeComments = () => {
    setCommentsOpen(false);
    setCommentsPostId(null);
    setCommentsPostTitle("");
    setComments([]);
    setCommentText("");
  };

  const fetchComments = async (feedId: string) => {
    try {
      setCommentsLoading(true);

      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setComments([]);
        return;
      }

      const res = await fetch(
        `${BASE_URL}/feed/${feedId}/comments?page=1&limit=50`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const raw = await res.text();
        throw new Error(raw || `Erro ${res.status}`);
      }

      const json = await res.json();
      setComments(Array.isArray(json?.data) ? json.data : []);
    } catch (e: any) {
      Alert.alert(
        "Erro",
        e?.message || "Não foi possível carregar comentários."
      );
    } finally {
      setCommentsLoading(false);
    }
  };

  const sendComment = async () => {
    const feedId = commentsPostId;
    const text = commentText.trim();

    if (!feedId) return;
    if (!text) {
      Alert.alert("Atenção", "Digite um comentário.");
      return;
    }
    if (sendingComment) return;

    try {
      setSendingComment(true);

      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Erro", "Você precisa estar logado para comentar.");
        return;
      }

      const res = await fetch(`${BASE_URL}/feed/${feedId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: text }),
      });

      const raw = await res.text();
      if (!res.ok) {
        let msg: any = raw || "Falha ao comentar";
        try {
          const data = raw ? JSON.parse(raw) : {};
          msg = data?.message || data?.error || msg;
          if (Array.isArray(msg)) msg = msg[0];
        } catch {}
        throw new Error(msg);
      }

      setCommentText("");

      // ✅ Atualiza lista
      await fetchComments(feedId);

      // ✅ Atualiza contador local (se existir)
      setPosts((prev) =>
        prev.map((p) =>
          p.id === feedId
            ? { ...p, commentsCount: (p.commentsCount || 0) + 1 }
            : p
        )
      );
    } catch (e: any) {
      Alert.alert(
        "Erro",
        e?.message || "Não foi possível enviar o comentário."
      );
    } finally {
      setSendingComment(false);
    }
  };

  const renderItem = ({ item }: { item: Post }) => {
    const badge = item.type ?? "Post";
    const author = item.author?.name ?? item.userName ?? "Autor";

    const handleEdit = () => {
      router.push({
        pathname: "/(tabs)/create-post",
        params: {
          mode: "edit",
          id: item.id,
          title: item.title,
          content: item.content,
          imageUrl: item.imageUrl || "",
          images: JSON.stringify(item.images || []),
        },
      });
    };

    const isExpanded = expandedPosts[item.id] === true;
    const shouldShowToggle = (item.content || "").length > 120;
    const isConfirmingDelete = confirmDeleteId === item.id;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.badge, badgeStyles(badge)]}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.cardAuthor}>por {author}</Text>

            {item.edit && (
              <View style={styles.actionsRow}>
                {isConfirmingDelete ? (
                  <>
                    <TouchableOpacity
                      style={styles.confirmDeleteBtn}
                      onPress={() => handleConfirmDelete(item.id)}
                    >
                      <Text style={styles.confirmDeleteText}>Confirmar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.cancelDeleteBtn}
                      onPress={() => setConfirmDeleteId(null)}
                    >
                      <Text style={styles.cancelDeleteText}>Cancelar</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                      style={styles.editBtn}
                      onPress={handleEdit}
                    >
                      <Text style={styles.editBtnText}>Editar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => handleAskDelete(item.id)}
                    >
                      <Text style={styles.deleteBtnText}>Excluir</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}
          </View>
        </View>

        <Text style={styles.cardTitle}>{item.title}</Text>

        {/* Descrição com Ler mais / Ler menos */}
        <Text
          style={styles.cardDesc}
          numberOfLines={isExpanded ? undefined : 3}
          ellipsizeMode="tail"
        >
          {item.content}
        </Text>

        {shouldShowToggle && (
          <TouchableOpacity
            onPress={() => toggleExpand(item.id)}
            style={styles.readMoreBtn}
          >
            <Text style={styles.readMoreText}>
              {isExpanded ? "Ler menos" : "Ler mais"}
            </Text>
          </TouchableOpacity>
        )}

        {/* Imagem Principal */}
        {!!item.imageUrl && (
          <View style={styles.postImageContainer}>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.postMainImage}
              resizeMode="cover"
              onError={(e) =>
                console.log(
                  "Erro ao carregar imagem:",
                  item.imageUrl,
                  e.nativeEvent.error
                )
              }
            />
          </View>
        )}

        {/* Galeria de Imagens */}
        {!!item.images?.length && (
          <View style={styles.postGalleryContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.postGallery}
            >
              {item.images.map((imgUri, idx) => (
                <Image
                  key={idx}
                  source={{ uri: imgUri }}
                  style={styles.postGalleryImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>
        )}

        {!!item.tags?.length && (
          <View style={styles.tagsRow}>
            {item.tags.map((t, i) => renderTag(t, i))}
          </View>
        )}

        <View style={styles.likeSection}>
          <TouchableOpacity
            style={[
              styles.likeButton,
              item.hasLiked && { backgroundColor: "#E0F2FE" },
              likingPosts.has(item.id) && { opacity: 0.5 },
            ]}
            onPress={() => handleLike(item.id)}
            activeOpacity={0.7}
            disabled={likingPosts.has(item.id)}
          >
            <Text
              style={[styles.likeIcon, item.hasLiked && styles.likeIconActive]}
            >
              {item.hasLiked ? "👍" : "👍"}
            </Text>
            {(item.likesCount ?? 0) > 0 && (
              <Text
                style={[
                  styles.likesCount,
                  item.hasLiked && styles.likeTextActive,
                ]}
              >
                {item.likesCount}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* ✅ ADICIONADO: botão Comentários (sem remover nada) */}
        <View style={styles.commentSection}>
          <TouchableOpacity
            style={styles.commentButton}
            onPress={() => openComments(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.commentIcon}>💬</Text>
            <Text style={styles.commentBtnText}>
              Comentários
              {(item.commentsCount ?? 0) > 0 ? ` (${item.commentsCount})` : ""}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.brandLeft}>
          <Image
            source={require("../images/logo.jpeg")}
            style={styles.logo}
            resizeMode="cover"
          />
          <Text style={styles.brandText}>OpenMind Tech</Text>
        </View>

        <TouchableOpacity
          onPress={handleOpenProfile}
          style={styles.profileBtn}
          accessibilityLabel="Abrir perfil"
        >
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* MENSAGEM FLASH */}
      {!!flash && (
        <View
          style={[
            styles.flashBox,
            flash.type === "success" ? styles.flashSuccess : styles.flashError,
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

      {/* CARD DE PROGRESSO */}
      <View style={styles.progressCard}>
        <View>
          <Text style={styles.hello}>Olá, Dev!</Text>
          <Text style={styles.subtitle}>Continue seu progresso!</Text>
        </View>
        {/* <View style={styles.levelBox}>
          <Text style={styles.levelNumber}>12</Text>
          <Text style={styles.levelLabel}>Nível</Text>
        </View> */}
      </View>

      {/* FEED */}
      <Text style={styles.sectionTitle}>Seu Feed</Text>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={styles.centerText}>Carregando feed…</Text>
        </View>
      ) : (
        <>
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryBtn} onPress={fetchFeed}>
                <Text style={styles.retryText}>Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <FlatList
            data={posts}
            keyExtractor={(it) => String(it.id)}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 96 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyText}>Sem publicações ainda.</Text>
              </View>
            }
          />
        </>
      )}

      {/* FAB: novo post */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/(tabs)/create-post")}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>+ Novo Post</Text>
      </TouchableOpacity>

      {/* ===== MODAL PERFIL ===== */}
      <Modal
        visible={profileOpen}
        transparent
        animationType="fade"
        onRequestClose={handleCloseProfile}
      >
        {/* backdrop */}
        <Pressable style={styles.backdrop} onPress={handleCloseProfile} />
        {/* sheet */}
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>Perfil</Text>

          {/* <TouchableOpacity style={styles.sheetBtn} onPress={goEditProfile}>
            <Text style={styles.sheetBtnText}>Alterar cadastro</Text>
          </TouchableOpacity> */}

          <View style={styles.divider} />

          <TouchableOpacity
            style={[styles.sheetBtn, styles.logoutBtn]}
            onPress={handleLogout}
          >
            <Text style={[styles.sheetBtnText, styles.logoutText]}>Sair</Text>
          </TouchableOpacity>

          <Stack.Screen options={{ headerShown: false }} />

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={handleCloseProfile}
          >
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {/* ======================== */}

      {/* ✅ ADICIONADO: MODAL COMENTÁRIOS */}
      <Modal
        visible={commentsOpen}
        transparent
        animationType="slide"
        onRequestClose={closeComments}
      >
        <Pressable style={styles.backdrop} onPress={closeComments} />

        <View style={styles.commentsSheet}>
          <View style={styles.commentsHeader}>
            <Text style={styles.commentsTitle}>Comentários</Text>
            <TouchableOpacity onPress={closeComments}>
              <Text style={styles.commentsClose}>Fechar</Text>
            </TouchableOpacity>
          </View>

          {!!commentsPostTitle && (
            <Text style={styles.commentsPostTitle} numberOfLines={1}>
              {commentsPostTitle}
            </Text>
          )}

          {commentsLoading ? (
            <View style={styles.commentsCenter}>
              <ActivityIndicator />
              <Text style={styles.centerText}>Carregando comentários…</Text>
            </View>
          ) : (
            <FlatList
              data={comments}
              keyExtractor={(c) => c.id}
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: 92 }}
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Text style={styles.emptyText}>Nenhum comentário ainda.</Text>
                </View>
              }
              renderItem={({ item: c }) => (
                <View style={styles.commentItem}>
                  <View style={styles.commentTopRow}>
                    <Text style={styles.commentAuthor}>
                      {c.userName || "Usuário"}
                    </Text>
                    <Text style={styles.commentDate}>
                      {c.createdAt
                        ? new Date(c.createdAt).toLocaleString()
                        : ""}
                    </Text>
                  </View>
                  <Text style={styles.commentBody}>{c.content}</Text>
                </View>
              )}
            />
          )}

          <View style={styles.commentComposer}>
            <TextInput
              value={commentText}
              onChangeText={setCommentText}
              placeholder="Escreva um comentário..."
              style={styles.commentInput}
              editable={!sendingComment}
              multiline
            />
            <TouchableOpacity
              style={[
                styles.commentSendBtn,
                sendingComment && { opacity: 0.6 },
              ]}
              onPress={sendComment}
              disabled={sendingComment}
            >
              {sendingComment ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.commentSendText}>Enviar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* ============================ */}
    </SafeAreaView>
  );
}

function badgeStyles(kind: string) {
  if (kind?.toLowerCase() === "quiz")
    return { backgroundColor: "#E7F1FF", borderColor: "#B9D2FF" };
  if (
    kind?.toLowerCase() === "exercício" ||
    kind?.toLowerCase() === "exercicio"
  )
    return { backgroundColor: "#FFF4E1", borderColor: "#FFD79A" };
  return { backgroundColor: "#F1F5F9", borderColor: "#E2E8F0" };
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FAFC" },

  /* Header */
  header: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  logo: { width: 28, height: 28, borderRadius: 14 },
  brandText: { fontSize: 16, fontWeight: "700", color: "#0F172A" },
  profileBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  profileIcon: { fontSize: 18 },

  /* Flash Message */
  flashBox: {
    marginHorizontal: 16,
    marginTop: 8,
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
  },
  flashSuccess: { borderColor: "#b3ffd4", backgroundColor: "#e6fff1" },
  flashError: { borderColor: "#ffb3b3", backgroundColor: "#ffe6e6" },
  flashTitle: { fontWeight: "700", marginBottom: 4, color: "#0F172A" },
  flashText: { color: "#2d2d2d" },
  flashClose: { alignSelf: "flex-end", marginTop: 6 },
  flashCloseText: { color: "#0EA5E9", fontWeight: "600" },

  /* Progress Card */
  progressCard: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: "#6E8EFB",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  hello: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 2 },
  subtitle: { color: "#EEF2FF", fontSize: 13 },
  levelBox: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 72,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  levelNumber: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 28,
  },
  levelLabel: { color: "#EEF2FF", fontSize: 12, marginTop: 2 },

  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },

  /* Cards */
  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    justifyContent: "space-between",
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeText: { fontSize: 12, fontWeight: "700", color: "#334155" },
  cardAuthor: { color: "#64748B", fontSize: 12, fontWeight: "600" },

  actionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },

  editBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#0EA5E9",
    backgroundColor: "#E0F2FE",
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0369A1",
  },

  deleteBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#F87171",
    backgroundColor: "#FEE2E2",
  },
  deleteBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#B91C1C",
  },

  confirmDeleteBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#22C55E",
    backgroundColor: "#DCFCE7",
  },
  confirmDeleteText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#15803D",
  },

  cancelDeleteBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#CBD5F5",
    backgroundColor: "#E5E7EB",
  },
  cancelDeleteText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
  },

  cardTitle: { fontSize: 16, fontWeight: "800", color: "#0F172A" },
  cardDesc: { color: "#334155", marginTop: 6, lineHeight: 20 },

  readMoreBtn: {
    marginTop: 4,
    alignSelf: "flex-start",
    paddingVertical: 2,
  },
  readMoreText: {
    color: "#0EA5E9",
    fontWeight: "600",
    fontSize: 13,
  },

  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 10 },
  tag: {
    backgroundColor: "#F1F5F9",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagText: { color: "#475569", fontSize: 12, fontWeight: "600" },

  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  centerText: { marginTop: 8, color: "#334155" },

  errorBox: { paddingHorizontal: 16, paddingTop: 8 },
  errorText: { color: "#DC2626", marginBottom: 8 },
  retryBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#0EA5E9",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: { color: "#fff", fontWeight: "700" },

  empty: { alignItems: "center", marginTop: 48 },
  emptyText: { color: "#475569" },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    backgroundColor: "#0EA5E9",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  fabText: { color: "#fff", fontWeight: "800" },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheet: {
    position: "absolute",
    right: 16,
    top: 64,
    left: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
    color: "#0F172A",
  },
  sheetBtn: { paddingVertical: 12 },
  sheetBtnText: { fontSize: 15, color: "#0F172A", fontWeight: "600" },
  divider: { height: 1, backgroundColor: "#E2E8F0", marginVertical: 4 },
  logoutBtn: {},
  logoutText: { color: "#DC2626" },
  cancelBtn: {
    marginTop: 10,
    alignSelf: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  cancelText: { color: "#64748B", fontWeight: "600" },

  postImageContainer: {
    marginTop: 12,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  postMainImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#F1F5F9",
  },
  postGalleryContainer: {
    marginTop: 12,
  },
  postGallery: {
    flexDirection: "row",
  },
  postGalleryImage: {
    width: 140,
    height: 140,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  likeSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    alignSelf: "flex-start",
  },
  likeIcon: {
    fontSize: 20,
    opacity: 0.6,
  },
  likeIconActive: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  likeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  likeTextActive: {
    color: "#0EA5E9",
    fontWeight: "700",
  },
  likesCount: {
    fontSize: 15,
    fontWeight: "700",
    color: "#475569",
  },

  // ✅ ADICIONADO: estilos comentários
  commentSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  commentButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    alignSelf: "flex-start",
  },
  commentIcon: {
    fontSize: 18,
    opacity: 0.85,
  },
  commentBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
  },

  commentsSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: "85%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  commentsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  commentsTitle: { fontSize: 16, fontWeight: "800", color: "#0F172A" },
  commentsClose: { color: "#0EA5E9", fontWeight: "800" },
  commentsPostTitle: {
    marginTop: 6,
    marginBottom: 10,
    color: "#64748B",
    fontWeight: "600",
  },
  commentsCenter: { paddingVertical: 24, alignItems: "center" },

  commentItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  commentTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 4,
  },
  commentAuthor: { fontWeight: "800", color: "#0F172A" },
  commentDate: { color: "#94A3B8", fontSize: 12, fontWeight: "600" },
  commentBody: { color: "#334155", lineHeight: 20 },

  commentComposer: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-end",
  },
  commentInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  commentSendBtn: {
    backgroundColor: "#0EA5E9",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 88,
    alignItems: "center",
    justifyContent: "center",
  },
  commentSendText: { color: "#fff", fontWeight: "800" },
});
