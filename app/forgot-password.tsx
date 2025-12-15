// app/forgot-password.tsx
import { BASE_URL } from "@/env";
import { router, Stack } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState<{
    type: "success" | "error";
    title?: string;
    message?: string;
  } | null>(null);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 5000);
    return () => clearTimeout(t);
  }, [flash]);

  async function handleSend() {
    if (!email || !/\S+@\S+\.\S+/.test(email.trim())) {
      setFlash({
        type: "error",
        title: "E-mail inválido",
        message: "Informe um e-mail válido.",
      });
      return;
    }

    setLoading(true);
    setFlash(null);
    try {
      const resp = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const raw = await resp.text();
      let data: any = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {}

      if (!resp.ok) {
        let msg =
          data?.message || data?.error || raw || "Falha ao enviar solicitação.";
        if (resp.status === 404) msg = "E-mail não encontrado.";
        setFlash({ type: "error", title: "Erro", message: String(msg) });
        return;
      }

      const successMsg =
        data?.message ||
        "Instruções enviadas para seu e-mail se o usuário existir.";
      setFlash({
        type: "success",
        title: "Solicitação enviada",
        message: String(successMsg),
      });

      setTimeout(() => {
        router.replace({
          pathname: "/",
          params: {
            flashType: "success",
            flashTitle: "Verifique seu e-mail",
            flashMessage: successMsg,
          },
        });
      }, 1200);
    } catch (err: any) {
      const msg = (err?.message || "").toLowerCase().includes("network")
        ? "Sem conexão. Verifique sua internet."
        : err?.message || "Erro ao enviar solicitação.";
      setFlash({ type: "error", title: "Erro de conexão", message: msg });
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
          <Text style={styles.title}>Recuperar senha</Text>

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
            </View>
          )}

          <Text style={styles.helperText}>
            Informe o e-mail associado à sua conta.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
            returnKeyType="send"
          />

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handleSend}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Enviar instruções</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/")}>
            <Text style={styles.link}>Voltar ao login</Text>
          </TouchableOpacity>

          <Stack.Screen options={{ headerShown: false }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 16 },
  content: {
    flexGrow: 1,
    maxWidth: 520,
    width: "100%",
    alignSelf: "center",
    alignItems: "stretch",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
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
  helperText: { color: "#666", marginBottom: 8 },
});
