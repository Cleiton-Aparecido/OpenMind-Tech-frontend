// RegisterScreen.tsx
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const MIN_DATE = new Date(1900, 0, 1);
const MAX_DATE = new Date(); // hoje

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

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [senha, setSenha] = useState("");
  const [email, setEmail] = useState("");
  const [birthText, setBirthText] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ⚠️ Em dispositivo físico, troque para o IP da sua máquina (ex.: http://192.168.0.10:3001)
  const baseURL = useMemo(() => {
    if (Platform.OS === "android") return "http://10.0.2.2:3001";
    return "http://localhost:3001";
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

  const handleSubmit = async () => {
    // validações locais
    validateAndNormalizeTextDate();

    if (!name.trim() || !email.trim() || !senha.trim()) {
      Alert.alert("Campos obrigatórios", "Preencha nome, e-mail e senha.");
      return;
    }
    // validação simples de e-mail
    const emailOk = /\S+@\S+\.\S+/.test(email);
    if (!emailOk) {
      Alert.alert("E-mail inválido", "Informe um e-mail válido.");
      return;
    }
    if (senha.length < 6) {
      Alert.alert("Senha fraca", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const resp = await fetch(`${baseURL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ⚠️ O backend (pelo seu curl) espera exatamente estas chaves:
        body: JSON.stringify({ email, name, password: senha }),
        signal: controller.signal,
      });

      const raw = await resp.text();
      let data: any = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {}

      if (!resp.ok) {
        const msg =
          data?.message ||
          data?.error ||
          raw ||
          "Não foi possível criar o usuário.";
        throw new Error(
          typeof msg === "string"
            ? msg
            : Array.isArray(msg)
            ? msg[0]
            : "Erro ao criar usuário"
        );
      }

      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!", [
        {
          text: "Ir para Login",
          onPress: () => navigation.navigate("Login"),
        },
      ]);
    } catch (err: any) {
      const cancelled = err?.name === "AbortError";
      Alert.alert(
        "Erro",
        cancelled
          ? "Tempo de requisição esgotado."
          : err?.message || "Falha no cadastro."
      );
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.menu}>
        <Image
          source={require("../images/logo.jpeg")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Criar Usuário</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          returnKeyType="next"
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          returnKeyType="next"
          editable={!loading}
        />

        {/* Caso queira usar data de nascimento depois, mantenho os handlers */}
        {/* Botão para abrir o picker (opcional) */}
        {/* <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setShowPicker(true)}
          disabled={loading}
        >
          <Text style={styles.secondaryButtonText}>Data</Text>
        </TouchableOpacity> */}

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

        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          returnKeyType="done"
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.buttonText}>Criar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    width: "100%",
  },
  menu: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    width: "80%",
  },
  logo: { maxHeight: 300, width: "80%" },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    width: "100%",
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: { color: "#d00", alignSelf: "flex-start" },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    marginTop: 12,
    width: "100%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  secondaryButton: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#007bff",
    paddingVertical: 8,
    width: 60,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  secondaryButtonText: { color: "#007bff", fontWeight: "600" },
});
