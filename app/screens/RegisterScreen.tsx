import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MaskInput, { Masks } from "react-native-mask-input";

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
  // birthText = o que o usuário DIGITA; birthDate = objeto Date válido (ou null)
  const [birthText, setBirthText] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);

  // Quando o usuário termina de editar (onBlur) validamos + limitamos
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
      // Se estava fora do limite, ajusta e reflete no texto
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

  // Quando o usuário escolhe no DatePicker
  const handlePickerChange = (_: any, selected?: Date) => {
    if (Platform.OS === "android") setShowPicker(false);
    if (!selected) return;
    const clamped = clampDate(selected, MIN_DATE, MAX_DATE);
    setBirthDate(clamped);
    setBirthText(formatBR(clamped));
    setDateError(null);
  };

  const handleSubmit = () => {
    // Força uma última validação do texto digitado
    validateAndNormalizeTextDate();
    if (!name.trim() || !senha.trim()) {
      Alert.alert("Campos obrigatórios", "Preencha nome e senha.");
      return;
    }
    if (!birthDate) {
      Alert.alert(
        "Data inválida",
        dateError || "Digite ou selecione uma data de nascimento."
      );
      return;
    }
    Alert.alert(
      "Sucesso",
      `Usuário cadastrado!\nNascimento: ${formatBR(birthDate)}`
    );
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../images/logo.jpeg")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Criar Usuário</Text>

      {/* Nome (editável) */}
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        returnKeyType="next"
      />

      {/* Senha (editável) */}
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        returnKeyType="done"
      />

      {/* Data de nascimento: DIGITÁVEL + PICKER */}
      <View style={{ gap: 8, marginBottom: 12 }}>
        <MaskInput
          style={styles.input}
          placeholder="Data de Nascimento (DD/MM/AAAA)"
          value={birthText}
          onChangeText={setBirthText}
          onBlur={validateAndNormalizeTextDate}
          mask={Masks.DATE_DDMMYYYY}
          keyboardType="numeric"
          maxLength={10}
        />
        {/* <TouchableOpacity
          onPress={() => setShowPicker(true)}
          style={styles.secondaryButton}
        > */}
        {/* <Text style={styles.secondaryButtonText}>Escolher no calendário</Text> */}
        {/* </TouchableOpacity> */}
        {!!dateError && <Text style={styles.errorText}>{dateError}</Text>}
      </View>

      {/* iOS: spinner/inline; Android: modal. */}
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

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  logo: { height: 200, alignSelf: "center", marginBottom: 20 },
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
    borderRadius: 8,
  },
  errorText: { color: "#d00" },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    marginTop: 12,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  secondaryButton: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  secondaryButtonText: { color: "#007bff", fontWeight: "600" },
});
