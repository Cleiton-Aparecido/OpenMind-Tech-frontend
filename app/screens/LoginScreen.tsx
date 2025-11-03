import { BASE_URL } from "@/env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

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

  // Recebe mensagens vindas de outras telas (ex: pós-cadastro)
  useEffect(() => {
    if (flashType || flashTitle || flashMessage) {
      setFlash({
        type: (flashType as any) || "success",
        title: flashTitle,
        message: flashMessage,
      });
    }
  }, [flashType, flashTitle, flashMessage]);

  // Auto-fecha o flash após 5s
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
          // JSON inválido: mantém msg padrão/raw
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
        return; // Não continua para o fluxo de sucesso
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
          <Text style={styles.title}>Login</Text>

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
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
            returnKeyType="next"
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            editable={!loading}
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/forgot-password")}>
            <Text style={styles.link}>Esqueci minha senha</Text>
          </TouchableOpacity>
          <Stack.Screen options={{ headerShown: false }} />
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={styles.link}>Criar conta</Text>
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
});
