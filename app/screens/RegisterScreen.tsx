import { BASE_URL } from "@/env";
import { router, Stack } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

const ROLE_OPTIONS = [
  "",
  "Desenvolvedor Júnior",
  "Desenvolvedor Pleno",
  "Desenvolvedor Sênior",
  "Tech Lead",
  "Arquiteto de Software",
  "Engenheiro de Software",
  "Analista de Sistemas",
  "Analista de Dados",
  "Cientista de Dados",
  "Engenheiro de Dados",
  "Engenheiro de Machine Learning",
  "DevOps Engineer",
  "SRE (Site Reliability Engineer)",
  "QA/Tester",
  "Analista de QA",
  "Designer UX/UI",
  "Product Manager",
  "Scrum Master",
  "Gerente de Projetos",
  "Analista de Segurança",
  "Administrador de Sistemas",
  "Administrador de Banco de Dados",
  "Suporte Técnico",
  "Estagiário",
  "Estudante",
  "Outro",
];

export default function RegisterScreen() {
  // ---- FORM STATES ----
  const [name, setName] = useState("");
  const [senha, setSenha] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  // ---- DATE (DIGITADA) ----
  const [birthText, setBirthText] = useState("");
  const [dateError, setDateError] = useState<string | null>(null);

  // ---- UI FLAGS ----
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [roleModalVisible, setRoleModalVisible] = useState(false);

  // ---- ERROR SYSTEM ----
  const [apiInfo, setApiInfo] = useState<any>(null);
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [errors, setErrors] = useState<{ [k: string]: string | null }>({});

  const { height, width } = useWindowDimensions();

  const isSmallHeight = height < 680;
  const isSmallWidth = width < 360;
  const isTablet = width > 600;

  // ---- VALIDAR DATA DIGITADA ----
  function validateBirthDate(text: string) {
    if (!text) {
      setDateError(null);
      return;
    }

    const regex = /^([0-2]\d|3[0-1])\/(0\d|1[0-2])\/\d{4}$/;

    if (!regex.test(text)) {
      setDateError("Data inválida (use DD/MM/AAAA).");
      return;
    }

    const [dd, mm, yyyy] = text.split("/").map(Number);
    const d = new Date(yyyy, mm - 1, dd);

    if (
      d.getFullYear() !== yyyy ||
      d.getMonth() !== mm - 1 ||
      d.getDate() !== dd
    ) {
      setDateError("Data inexistente.");
      return;
    }

    setDateError(null);
  }

  // ---- VALIDAR CAMPOS ----
  const validate = useCallback(
    (state?: { name: string; email: string; senha: string }) => {
      const n = state?.name ?? name;
      const e = state?.email ?? email;
      const s = state?.senha ?? senha;

      return {
        name: n.trim() ? null : "Informe seu nome completo.",
        email: /\S+@\S+\.\S+/.test(e.trim().toLowerCase())
          ? null
          : "Informe um e-mail válido.",
        senha:
          s.length >= 6 ? null : "A senha deve ter pelo menos 6 caracteres.",
      };
    },
    [name, email, senha]
  );

  useEffect(() => {
    setErrors(validate());
  }, [name, email, senha]);

  const formValid = !errors.name && !errors.email && !errors.senha;

  // ---- SUBMIT ----
  const handleSubmit = async () => {
    setTouched({ name: true, email: true, senha: true });

    const curErrors = validate();
    setErrors(curErrors);

    if (curErrors.name || curErrors.email || curErrors.senha || dateError) {
      setApiInfo({
        type: "error",
        message: "Por favor, revise os campos.",
      });
      return;
    }

    setLoading(true);
    setApiInfo(null);

    try {
      const resp = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: name.trim(),
          password: senha,
          ...(role && { role }),
          birthDate: birthText || null,
        }),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        setApiInfo({
          type: "error",
          message: data?.message || "Erro ao criar usuário.",
        });
        return;
      }

      router.replace({
        pathname: "/",
        params: {
          flashType: "success",
          flashTitle: "Conta criada!",
          flashMessage: "Faça login para começar.",
        },
      });
    } catch (err: any) {
      setApiInfo({
        type: "error",
        message: "Falha na conexão.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ============================
  //          UI
  // ============================

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            isSmallHeight && styles.scrollContentCompact,
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.centerWrapper}>
            <View style={[styles.card, isTablet && styles.cardTablet]}>
              {/* LOGO */}
              <Image
                source={require("../images/logo.jpeg")}
                style={[
                  styles.logo,
                  isSmallHeight && styles.logoSmall,
                  isSmallWidth && styles.logoVerySmall,
                  isTablet && styles.logoTablet,
                ]}
                resizeMode="contain"
              />

              <Text
                style={[
                  styles.title,
                  isSmallHeight && styles.titleSmall,
                  isTablet && styles.titleTablet,
                ]}
              >
                Criar Usuário
              </Text>

              {/* REGRAS */}
              <View style={styles.rulesBox}>
                <Text style={styles.rulesItem}>
                  • Preencha todos os campos.
                </Text>
                <Text style={styles.rulesItem}>• E-mail válido.</Text>
                <Text style={styles.rulesItem}>• Senha de 6+ caracteres.</Text>
              </View>

              {/* NOME */}
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
              />
              {touched.name && errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}

              {/* EMAIL */}
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
                keyboardType="email-address"
              />
              {touched.email && errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              {/* SENHA */}
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
                  secureTextEntry={!showPassword}
                  value={senha}
                  onChangeText={(v) => {
                    setSenha(v);
                    setTouched((t) => ({ ...t, senha: true }));
                  }}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Text style={styles.togglePwd}>
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </Text>
                </Pressable>
              </View>
              {touched.senha && errors.senha && (
                <Text style={styles.errorText}>{errors.senha}</Text>
              )}

              {/* DATA DIGITADA */}
              <Text style={styles.pickerLabel}>
                Data de nascimento (opcional)
              </Text>
              <TextInput
                style={[styles.input, dateError && styles.inputError]}
                placeholder="DD/MM/AAAA"
                keyboardType="numeric"
                maxLength={10}
                value={birthText}
                onChangeText={(v) => {
                  let txt = v.replace(/\D/g, "");

                  if (txt.length >= 3 && txt.length <= 4)
                    txt = txt.replace(/(\d{2})(\d{1,2})/, "$1/$2");
                  else if (txt.length > 4)
                    txt = txt.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");

                  setBirthText(txt);
                  validateBirthDate(txt);
                }}
              />

              {!!dateError && <Text style={styles.errorText}>{dateError}</Text>}

              {/* PROFISSÃO */}
              <Text style={styles.pickerLabel}>
                Cargo na área de TI (opcional)
              </Text>

              <Pressable
                style={styles.input}
                onPress={() => setRoleModalVisible(true)}
              >
                <Text style={{ color: role ? "#111" : "#777" }}>
                  {role || "Selecionar cargo"}
                </Text>
              </Pressable>

              <Modal
                visible={roleModalVisible}
                transparent
                animationType="fade"
              >
                <View style={styles.overlay}>
                  <Pressable
                    style={styles.backdrop}
                    onPress={() => setRoleModalVisible(false)}
                  />

                  <View
                    style={[
                      styles.modalCard,
                      isTablet && styles.modalCardTablet,
                    ]}
                  >
                    <Text style={styles.modalTitle}>Selecione seu cargo</Text>

                    <ScrollView style={{ maxHeight: 350 }}>
                      {ROLE_OPTIONS.map((item) => (
                        <Pressable
                          key={item}
                          style={[
                            styles.modalItem,
                            item === role && styles.modalItemSelected,
                          ]}
                          onPress={() => {
                            setRole(item);
                            setRoleModalVisible(false);
                          }}
                        >
                          <Text style={styles.modalItemText}>
                            {item || "Nenhum / Prefiro não informar"}
                          </Text>
                        </Pressable>
                      ))}
                    </ScrollView>

                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setRoleModalVisible(false)}
                    >
                      <Text style={styles.closeText}>Fechar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              {/* FEEDBACK */}
              {apiInfo && (
                <View
                  style={[
                    styles.feedbackBox,
                    apiInfo.type === "error"
                      ? styles.feedbackError
                      : styles.feedbackSuccess,
                  ]}
                >
                  <Text style={styles.feedbackTitle}>{apiInfo.message}</Text>
                </View>
              )}

              {/* BOTÃO */}
              <TouchableOpacity
                style={[
                  styles.button,
                  (!formValid || loading) && { opacity: 0.6 },
                ]}
                disabled={!formValid || loading || !!dateError}
                onPress={handleSubmit}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Criar conta</Text>
                )}
              </TouchableOpacity>

              {/* LOGIN */}
              <TouchableOpacity
                style={styles.secondaryAction}
                onPress={() => router.replace("/")}
              >
                <Text style={styles.secondaryActionText}>
                  Já tenho conta • Ir para Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* =====================
       STYLES
===================== */

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f5f5" },
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 16 },
  scrollContentCompact: { paddingVertical: 8 },
  centerWrapper: { flex: 1, alignItems: "center", justifyContent: "center" },

  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 22,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },

  cardTablet: {
    maxWidth: 500,
    padding: 26,
  },

  // --- LOGO ---
  logo: {
    width: "55%",
    alignSelf: "center",
    aspectRatio: 3,
    marginBottom: 20,
  },
  logoSmall: { width: "48%" },
  logoVerySmall: { width: "42%" },
  logoTablet: { width: "40%" },

  // --- TITLE ---
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 18,
    color: "#111",
  },
  titleSmall: {
    fontSize: 24,
    marginBottom: 14,
  },
  titleTablet: {
    fontSize: 32,
    marginBottom: 24,
  },

  // --- RULES ---
  rulesBox: {
    backgroundColor: "#eef2ff",
    borderWidth: 1,
    borderColor: "#c7d2fe",
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  rulesItem: { color: "#374151", fontSize: 14 },

  // --- INPUTS ---
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 8,
    fontSize: 15,
  },

  inputRow: { flexDirection: "row", alignItems: "center" },

  togglePwd: { color: "#2563eb", fontWeight: "600" },

  pickerLabel: {
    marginTop: 6,
    marginBottom: 4,
    fontWeight: "600",
    color: "#111",
    fontSize: 14,
  },

  // --- ERROR ---
  errorText: { color: "#b10000", fontSize: 12, marginBottom: 6 },
  inputError: { borderColor: "#ff9aa2", backgroundColor: "#fff4f4" },

  // --- MODAL ---
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  backdrop: { ...StyleSheet.absoluteFillObject },

  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    maxHeight: "80%",
  },

  modalCardTablet: {
    maxWidth: 500,
    alignSelf: "center",
  },

  modalTitle: { fontWeight: "700", fontSize: 18, textAlign: "center" },

  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  modalItemSelected: {
    backgroundColor: "#e0e7ff",
  },
  modalItemText: { fontSize: 15 },

  closeButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  closeText: { textAlign: "center", color: "#2563eb", fontWeight: "600" },

  // --- FEEDBACK ---
  feedbackBox: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
  },
  feedbackError: {
    borderColor: "#ffb3b3",
    backgroundColor: "#ffe6e6",
  },
  feedbackSuccess: {
    borderColor: "#b3ffd4",
    backgroundColor: "#e6fff1",
  },
  feedbackTitle: { fontWeight: "700", fontSize: 14 },

  // --- BUTTON ---
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  // --- SECONDARY ---
  secondaryAction: { marginTop: 16 },
  secondaryActionText: {
    textAlign: "center",
    color: "#2563eb",
    fontWeight: "600",
  },
});
