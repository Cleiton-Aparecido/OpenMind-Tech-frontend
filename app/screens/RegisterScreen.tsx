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
  const [email, setEmail] = useState("");
  const [profissao, setProfissao] = useState("");
  const [birthText, setBirthText] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);

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
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="words"
          returnKeyType="next"
        />

        <TextInput
          style={styles.input}
          placeholder="profissão"
          value={profissao}
          onChangeText={setProfissao}
          autoCapitalize="words"
          returnKeyType="next"
        />

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
        {!!dateError && <Text style={styles.errorText}>{dateError}</Text>}

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
        {/* Senha (editável) */}
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          returnKeyType="done"
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Criar</Text>
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
    // Adicionado para centralizar os itens horizontalmente
    alignItems: "center",
    backgroundColor: "#fff",
    width: "100%",
  },
  menu: {
    flex: 1,
    justifyContent: "flex-start",
    // Adicionado para centralizar os itens horizontalmente
    alignItems: "center",
    backgroundColor: "#fff",

    width: "80%",
  },
  logo: {
    maxHeight: 300, // Diminuí um pouco para telas menores
    width: "80%",
  },
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
    // Alterado para largura de 100% para ser responsivo
    width: "100%",
    borderRadius: 8,
    marginBottom: 12, // Movido margin para cá para ser consistente
  },

  errorText: {
    color: "#d00",
    alignSelf: "flex-start", // Alinha o texto de erro à esquerda
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    marginTop: 12,
    // Alterado para largura de 100% para consistência
    width: "100%",
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  secondaryButton: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#007bff",
    paddingVertical: 8,
    width: 40,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  secondaryButtonText: { color: "#007bff", fontWeight: "600" },
});
