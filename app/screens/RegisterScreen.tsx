// app/screens/RegisterScreen.tsx
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const MIN_DATE = new Date(1900, 0, 1);
const MAX_DATE = new Date();

function parseDDMMYYYY(s: string) {
  const [dd, mm, yyyy] = s.split("/").map((v) => Number(v));
  if (!dd || !mm || !yyyy) return null;
  const dt = new Date(yyyy, mm - 1, dd);
  if (
    dt.getFullYear() !== yyyy ||
    dt.getMonth() !== mm - 1 ||
    dt.getDate() !== dd
  )
    return null;
  return dt;
}
function clampDate(d: Date, min: Date, max: Date) {
  if (d < min) return min;
  if (d > max) return max;
  return d;
}
function formatBR(d: Date) {
  return d.toLocaleDateString("pt-BR");
}

type ApiInfo = {
  status?: number;
  message?: string;
  requestId?: string | null;
  type: "error" | "success";
};

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [senha, setSenha] = useState("");
  const [email, setEmail] = useState("");
  const [birthText, setBirthText] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [apiInfo, setApiInfo] = useState<ApiInfo | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [errors, setErrors] = useState<{ [k: string]: string | null }>({});

  const baseURL = useMemo(() => {
    if (Platform.OS === "android") return "http://10.0.2.2:3001";
    return "http://localhost:3010";
  }, []);

  const validateAndNormalizeTextDate = () => {
    if (birthText.length === 0) {
      setBirthDate(null);
      setDateError(null);
      return;
    }
    if (birthText.length < 10) {
      setDateError("Data incompleta (use DD/MM/AAAA).");
      setBirthDate(null);
      return;
    }
    const parsed = parseDDMMYYYY(birthText);
    if (!parsed) {
      setDateError("Data inexistente.");
      setBirthDate(null);
      return;
    }
    const clamped = clampDate(parsed, MIN_DATE, MAX_DATE);
    if (clamped.getTime() !== parsed.getTime()) {
      setBirthDate(clamped);
      setBirthText(formatBR(clamped));
      setDateError(
        clamped.getTime() === MIN_DATE.getTime()
          ? "Data ajustada para o mínimo permitido (01/01/1900)."
          : "Data ajustada para hoje (não é permitido futuro)."
      );
      return;
    }
    setBirthDate(parsed);
    setDateError(null);
  };

  const handlePickerChange = (_: any, selected?: Date) => {
    if (Platform.OS === "android") setShowPicker(false);
    if (!selected) return;
    const clamped = clampDate(selected, MIN_DATE, MAX_DATE);
    setBirthDate(clamped);
    setBirthText(formatBR(clamped));
    setDateError(null);
  };

  const validate = useCallback(
    (state?: { name: string; email: string; senha: string }) => {
      const n = state?.name ?? name;
      const e = state?.email ?? email;
      const s = state?.senha ?? senha;

      const next: typeof errors = {};
      next.name = n.trim() ? null : "Informe seu nome completo.";
      next.email = /\S+@\S+\.\S+/.test(e.trim().toLowerCase())
        ? null
        : "Informe um e-mail válido (ex.: nome@dominio.com).";
      next.senha =
        s.length >= 6 ? null : "A senha deve ter pelo menos 6 caracteres.";
      return next;
    },
    [name, email, senha, errors]
  );

  useEffect(() => {
    setErrors(validate());
  }, [name, email, senha]);

  const formValid = !errors.name && !errors.email && !errors.senha;

  const handleSubmit = async () => {
    setTouched({ name: true, email: true, senha: true });
    validateAndNormalizeTextDate();
    const curErrors = validate();
    setErrors(curErrors);
    if (curErrors.name || curErrors.email || curErrors.senha) {
      setApiInfo({
        type: "error",
        message: "Por favor, corrija os campos destacados.",
        status: undefined,
        requestId: null,
      });
      return;
    }

    setLoading(true);
    setApiInfo(null);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const resp = await fetch(`${baseURL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: name.trim(),
          password: senha,
        }),
        signal: controller.signal,
      });

      const raw = await resp.text();
      let data: any = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {}

      const requestId =
        resp.headers?.get?.("x-request-id") ||
        resp.headers?.get?.("x-correlation-id") ||
        null;

      if (!resp.ok) {
        let msg: any =
          data?.message ||
          data?.error ||
          raw ||
          "Não foi possível criar o usuário.";
        if (Array.isArray(msg)) msg = msg[0];
        if (resp.status === 409) msg = msg || "E-mail já cadastrado.";
        else if (resp.status === 400)
          msg = msg || "Dados inválidos. Verifique os campos.";
        else if (resp.status >= 500)
          msg = msg || "Falha no servidor. Tente mais tarde.";
        setApiInfo({
          type: "error",
          status: resp.status,
          message: String(msg),
          requestId,
        });
        return;
      }

      const successMsg =
        data?.message ||
        "Usuário cadastrado com sucesso! Você será redirecionado para o login.";
      setApiInfo({
        type: "success",
        status: resp.status,
        message: successMsg,
        requestId,
      });

      router.replace({
        pathname: "/",
        params: {
          flashType: "success",
          flashTitle: "Conta criada!",
          flashMessage: "Faça login para começar.",
        },
      });
    } catch (err: any) {
      const cancelled = err?.name === "AbortError";
      setApiInfo({
        type: "error",
        status: undefined,
        message: cancelled
          ? "Tempo de requisição esgotado."
          : err?.message || "Falha no cadastro.",
        requestId: null,
      });
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };

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

          <Text style={styles.title}>Criar Usuário</Text>

          <View style={styles.rulesBox}>
            <Text style={styles.rulesItem}>
              • Preencha todos os campos obrigatórios.
            </Text>
            <Text style={styles.rulesItem}>
              • E-mail válido (ex.: nome@dominio.com).
            </Text>
            <Text style={styles.rulesItem}>• Senha com 6+ caracteres.</Text>
          </View>

          <TextInput
            style={[
              styles.input,
              touched.name && errors.name && styles.inputError,
            ]}
            placeholder="Nome completo *"
            value={name}
            onChangeText={(v) => {
              setName(v);
              setTouched((t) => ({ ...t, name: true }));
            }}
            autoCapitalize="words"
            returnKeyType="next"
            editable={!loading}
          />
          {touched.name && errors.name ? (
            <Text style={styles.errorText}>{errors.name}</Text>
          ) : (
            <Text style={styles.helperText}>Como deseja ser chamado.</Text>
          )}

          <TextInput
            style={[
              styles.input,
              touched.email && errors.email && styles.inputError,
            ]}
            placeholder="E-mail *"
            value={email}
            onChangeText={(v) => {
              setEmail(v);
              setTouched((t) => ({ ...t, email: true }));
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
            editable={!loading}
          />
          {touched.email && errors.email ? (
            <Text style={styles.errorText}>{errors.email}</Text>
          ) : (
            <Text style={styles.helperText}>Usaremos para seu acesso.</Text>
          )}

          <View
            style={[
              styles.input,
              styles.inputRow,
              touched.senha && errors.senha && styles.inputError,
            ]}
          >
            <TextInput
              style={{ flex: 1 }}
              placeholder="Senha *"
              value={senha}
              onChangeText={(v) => {
                setSenha(v);
                setTouched((t) => ({ ...t, senha: true }));
              }}
              secureTextEntry={!showPassword}
              returnKeyType="done"
              editable={!loading}
            />
            <Pressable onPress={() => setShowPassword((p) => !p)} hitSlop={8}>
              <Text style={styles.togglePwd}>
                {showPassword ? "Ocultar" : "Mostrar"}
              </Text>
            </Pressable>
          </View>
          {touched.senha && errors.senha ? (
            <Text style={styles.errorText}>{errors.senha}</Text>
          ) : (
            <Text style={styles.helperText}>Mínimo de 6 caracteres.</Text>
          )}

          {showPicker && (
            <DateTimePicker
              value={birthDate || new Date(2000, 0, 1)}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handlePickerChange}
              minimumDate={MIN_DATE}
              maximumDate={MAX_DATE}
            />
          )}
          {!!dateError && <Text style={styles.errorText}>{dateError}</Text>}

          {!!apiInfo && (
            <View
              style={[
                styles.feedbackBox,
                apiInfo.type === "error"
                  ? styles.feedbackError
                  : styles.feedbackSuccess,
              ]}
            >
              <Text style={styles.feedbackTitle}>
                {apiInfo.type === "error" ? "Algo deu errado" : "Tudo certo"}
                {typeof apiInfo.status === "number"
                  ? ` • ${apiInfo.status}`
                  : ""}
              </Text>
              {!!apiInfo.message && (
                <Text style={styles.feedbackText}>{apiInfo.message}</Text>
              )}
              {!!apiInfo.requestId && (
                <Text style={styles.feedbackMeta}>
                  Req ID: {apiInfo.requestId}
                </Text>
              )}
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, (loading || !formValid) && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={loading || !formValid}
          >
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.buttonText}>
                {formValid ? "Criar conta" : "Preencha os campos"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryAction}
            onPress={() => router.replace("/")}
            disabled={loading}
          >
            <Text style={styles.secondaryActionText}>
              Já tenho conta • Ir para Login
            </Text>
          </TouchableOpacity>
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
  logo: { width: "100%", height: undefined, aspectRatio: 3, marginBottom: 8 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  rulesBox: {
    width: "100%",
    backgroundColor: "#f6f8ff",
    borderColor: "#e0e6ff",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  rulesItem: { color: "#2f3b66", fontSize: 13 },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    width: "100%",
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: "#fff",
  },
  inputRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  inputError: { borderColor: "#ff9aa2", backgroundColor: "#fff6f7" },

  helperText: {
    color: "#697386",
    alignSelf: "flex-start",
    marginBottom: 8,
    fontSize: 12,
  },
  errorText: {
    color: "#a10000",
    alignSelf: "flex-start",
    marginBottom: 8,
    fontSize: 12,
    fontWeight: "600",
  },

  feedbackBox: {
    width: "100%",
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  feedbackError: { borderColor: "#ffb3b3", backgroundColor: "#ffe6e6" },
  feedbackSuccess: { borderColor: "#b3ffd4", backgroundColor: "#e6fff1" },
  feedbackTitle: { fontWeight: "700", marginBottom: 4 },
  feedbackText: { color: "#2d2d2d" },
  feedbackMeta: { marginTop: 6, fontSize: 12, color: "#616161" },

  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    marginTop: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  togglePwd: { color: "#007bff", fontWeight: "600" },

  secondaryAction: { marginTop: 14, marginBottom: 8 },
  secondaryActionText: { color: "#007bff", fontWeight: "600" },
});
