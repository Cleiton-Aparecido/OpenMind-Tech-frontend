import { BASE_URL } from "@/env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [flash, setFlash] = useState<{
    type: "success" | "error";
    title?: string;
    message?: string;
  } | null>(null);

  const { flashType, flashTitle, flashMessage } = useLocalSearchParams<{
    flashType?: "success" | "error";
    flashTitle?: string;
    flashMessage?: string;
  }>();

  const { height, width } = useWindowDimensions();
  const isSmallHeight = height < 700;
  const isSmallWidth = width < 360;

  useEffect(() => {
    if (flashType || flashTitle || flashMessage) {
      setFlash({
        type: (flashType as any) || "success",
        title: flashTitle,
        message: flashMessage,
      });
    }
  }, [flashType, flashTitle, flashMessage]);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 5000);
    return () => clearTimeout(t);
  }, [flash]);

  async function handleLogin() {
    if (!email || !senha) {
      setFlash({
        type: "error",
        title: "Dados obrigatórios",
        message: "Preencha e-mail e senha.",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: senha }),
      });

      if (!response.ok) {
        const raw = await response.text();
        let msg: any = "Falha no login";

        try {
          const data = raw ? JSON.parse(raw) : {};
          msg =
            data?.message ||
            data?.error ||
            (Array.isArray(data?.errors) ? data.errors[0] : undefined) ||
            raw ||
            msg;
        } catch {
          // mantém msg padrão/raw
        }

        if (response.status === 400 || response.status === 401) {
          msg = typeof msg === "string" ? msg : "E-mail ou senha incorretos.";
        } else if (response.status >= 500) {
          msg = "Servidor indisponível. Tente novamente em alguns minutos.";
        }

        setFlash({
          type: "error",
          title: "Erro no login",
          message: String(msg),
        });
        return;
      }

      const data = await response.json();
      await AsyncStorage.setItem("userToken", data?.access_token ?? "");

      router.replace({
        pathname: "/(tabs)",
        params: {
          flashType: "success",
          flashTitle: "Bem-vindo!",
          flashMessage: "Login realizado com sucesso.",
        },
      });
    } catch (err: any) {
      const msg = (err?.message || "").toLowerCase().includes("network")
        ? "Sem conexão. Verifique sua internet."
        : err?.message || "Falha no login";
      setFlash({
        type: "error",
        title: "Erro de conexão",
        message: msg,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            isSmallHeight && styles.scrollContentCompact,
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.centerWrapper}>
            <View style={styles.card}>
              <Image
                source={require("../images/logo.jpeg")}
                style={[
                  styles.logo,
                  isSmallHeight && styles.logoSmall,
                  isSmallWidth && styles.logoVerySmall,
                ]}
                resizeMode="contain"
              />

              <Text
                style={[
                  styles.title,
                  isSmallWidth && { fontSize: 24 },
                  isSmallHeight && { marginBottom: 8 },
                ]}
              >
                Login
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
                    <Text
                      style={styles.flashTitle}
                      numberOfLines={2}
                      adjustsFontSizeToFit
                    >
                      {flash.title}
                    </Text>
                  )}
                  {!!flash.message && (
                    <Text
                      style={styles.flashText}
                      numberOfLines={3}
                      adjustsFontSizeToFit
                    >
                      {flash.message}
                    </Text>
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
                placeholder="Email"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
                returnKeyType="next"
              />

              <View style={[styles.input, styles.inputRow]}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Senha"
                  placeholderTextColor="#888"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((p) => !p)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.togglePwd}>
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.7 }]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Entrar</Text>
                )}
              </TouchableOpacity>

              {/* <TouchableOpacity onPress={() => router.push("/forgot-password")}>
                <Text style={styles.link}>Esqueci minha senha</Text>
              </TouchableOpacity> */}

              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text style={styles.link}>Criar conta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  scrollContentCompact: {
    paddingVertical: 8,
  },
  centerWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  logo: {
    width: "60%",
    alignSelf: "center",
    height: undefined,
    aspectRatio: 3,
    marginBottom: 16,
  },
  logoSmall: {
    width: "50%",
    marginBottom: 8,
  },
  logoVerySmall: {
    width: "45%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#111827",
  },
  flashBox: {
    width: "100%",
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  flashSuccess: {
    borderColor: "#b3ffd4",
    backgroundColor: "#e6fff1",
  },
  flashError: {
    borderColor: "#ffb3b3",
    backgroundColor: "#ffe6e6",
  },
  flashTitle: {
    fontWeight: "700",
    marginBottom: 4,
    fontSize: 14,
    color: "#111827",
  },
  flashText: {
    color: "#374151",
    fontSize: 13,
  },
  flashClose: {
    alignSelf: "flex-end",
    marginTop: 6,
  },
  flashCloseText: {
    color: "#2563EB",
    fontWeight: "600",
    fontSize: 13,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: "100%",
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#F9FAFB",
    fontSize: 14,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
    paddingRight: 8,
  },
  togglePwd: {
    color: "#2563EB",
    fontWeight: "600",
    fontSize: 13,
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 6,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 15,
  },
  link: {
    color: "#2563EB",
    textAlign: "center",
    marginTop: 12,
    fontSize: 13,
  },
});
