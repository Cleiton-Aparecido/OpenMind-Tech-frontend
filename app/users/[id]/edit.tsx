import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function EditUserScreen() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    birthDay: "",
    birthMonth: "",
    birthYear: "",
    profession: "",
    specialty: "",
  });

  const [message, setMessage] = useState("");

  function handleChange(field: string, value: string) {
    setUser((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit() {
    // Aqui depois você chama o backend com fetch/axios
    setMessage("Usuário atualizado! (demo)");
  }

  const days = Array.from({ length: 31 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) =>
    String(currentYear - i)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Edição de Perfil</Text>

      <Text>Nome:</Text>
      <TextInput
        style={styles.input}
        value={user.name}
        onChangeText={(t) => handleChange("name", t)}
      />

      <Text>Email:</Text>
      <TextInput
        style={styles.input}
        value={user.email}
        onChangeText={(t) => handleChange("email", t)}
        keyboardType="email-address"
      />

      <Text>Senha:</Text>
      <TextInput
        style={styles.input}
        value={user.password}
        onChangeText={(t) => handleChange("password", t)}
        secureTextEntry
      />

      <Text>Data de Nascimento:</Text>
      <View style={styles.birthdateRow}>
        <Picker
          selectedValue={user.birthDay}
          style={styles.birthInput}
          onValueChange={(v) => handleChange("birthDay", v)}
        >
          <Picker.Item label="Dia" value="" />
          {days.map((d) => (
            <Picker.Item key={d} label={d} value={d} />
          ))}
        </Picker>

        <Picker
          selectedValue={user.birthMonth}
          style={styles.birthInput}
          onValueChange={(v) => handleChange("birthMonth", v)}
        >
          <Picker.Item label="Mês" value="" />
          {months.map((m) => (
            <Picker.Item key={m} label={m} value={m} />
          ))}
        </Picker>

        <Picker
          selectedValue={user.birthYear}
          style={styles.birthInput}
          onValueChange={(v) => handleChange("birthYear", v)}
        >
          <Picker.Item label="Ano" value="" />
          {years.map((y) => (
            <Picker.Item key={y} label={y} value={y} />
          ))}
        </Picker>
      </View>

      <Text>Profissão:</Text>
      <TextInput
        style={styles.input}
        value={user.profession}
        onChangeText={(t) => handleChange("profession", t)}
      />

      <Text>Especialidade:</Text>
      <Picker
        selectedValue={user.specialty}
        style={styles.input}
        onValueChange={(v) => handleChange("specialty", v)}
      >
        <Picker.Item label="Selecione..." value="" />
        <Picker.Item label="Frontend" value="frontend" />
        <Picker.Item label="Backend" value="backend" />
        <Picker.Item label="DevOps" value="devops" />
        <Picker.Item label="DBA" value="dba" />
        <Picker.Item label="Analista de Dados" value="analista-dados" />
        <Picker.Item
          label="Analista de Segurança da Informação"
          value="analista-seguranca"
        />
      </Picker>

      <View style={styles.buttonContainer}>
        <Button title="Salvar" onPress={handleSubmit} color="#2196F3" />
      </View>

      {message ? <Text style={{ marginTop: 8 }}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 440,
    width: "90%",
    alignSelf: "center",
    marginTop: 24,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    alignSelf: "center",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#BBB",
    marginBottom: 14,
    padding: 8,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
  },
  birthdateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 16,
  },
  birthInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#BBB",
    borderRadius: 8,
    backgroundColor: "#FAFAFA",
  },
  buttonContainer: {
    marginTop: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
});
