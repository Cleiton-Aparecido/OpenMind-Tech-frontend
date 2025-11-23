import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

// Nenhum export options: só controlamos o header pelo layout, que está oculto.

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
    setUser({ ...user, [field]: value });
  }

  function handleSubmit() {
    setMessage("Usuário atualizado! (demo)");
  }

  // Arrays para Pickers
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, "0"));
  const months = [
    "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Edição de Perfil</Text>
      <Text>Nome:</Text>
      <TextInput
        value={user.name}
        onChangeText={text => handleChange("name", text)}
        style={styles.input}
      />
      <Text>Email:</Text>
      <TextInput
        value={user.email}
        onChangeText={text => handleChange("email", text)}
        style={styles.input}
        keyboardType="email-address"
      />
      <Text>Senha:</Text>
      <TextInput
        value={user.password}
        onChangeText={text => handleChange("password", text)}
        style={styles.input}
        secureTextEntry
      />
      <Text>Data de Nascimento:</Text>
      <View style={styles.birthdateRow}>
        <Picker
          selectedValue={user.birthDay}
          style={styles.birthInput}
          onValueChange={value => handleChange("birthDay", value)}
        >
          <Picker.Item label="Dia" value="" />
          {days.map(day => (
            <Picker.Item key={day} label={day} value={day} />
          ))}
        </Picker>
        <Picker
          selectedValue={user.birthMonth}
          style={styles.birthInput}
          onValueChange={value => handleChange("birthMonth", value)}
        >
          <Picker.Item label="Mês" value="" />
          {months.map(month => (
            <Picker.Item key={month} label={month} value={month} />
          ))}
        </Picker>
        <Picker
          selectedValue={user.birthYear}
          style={styles.birthInput}
          onValueChange={value => handleChange("birthYear", value)}
        >
          <Picker.Item label="Ano" value="" />
          {years.map(year => (
            <Picker.Item key={year} label={year} value={year} />
          ))}
        </Picker>
      </View>
      <Text>Profissão:</Text>
      <TextInput
        value={user.profession}
        onChangeText={text => handleChange("profession", text)}
        style={styles.input}
      />
      <Text>Especialidade:</Text>
      <Picker
        selectedValue={user.specialty}
        style={styles.input}
        onValueChange={itemValue => handleChange("specialty", itemValue)}
      >
        <Picker.Item label="Selecione..." value="" />
        <Picker.Item label="Frontend" value="frontend" />
        <Picker.Item label="Backend" value="backend" />
        <Picker.Item label="DevOps" value="devops" />
        <Picker.Item label="DBA" value="dba" />
        <Picker.Item label="Analista de Dados" value="analista-dados" />
        <Picker.Item label="Analista de Segurança da Informação" value="analista-seguranca" />
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
    gap: 8,
    justifyContent: "space-between",
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
    overflow: "hidden"
  },
});
