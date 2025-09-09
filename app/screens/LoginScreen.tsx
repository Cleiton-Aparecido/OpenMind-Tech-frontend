import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  Register: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <View style={styles.container}>
      {/* 👇 Exemplo com imagem local */}
      <View style={styles.menu}>
        <Image
          source={require("../images/logo.jpeg")} // coloque sua imagem em assets
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.link}>Esqueci minha senha</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}>Criar conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     // flex: 1,
//     // justifyContent: "center",
//     // paddingLeft: 20,
//     // paddingRight: 20,
//     backgroundColor: "#fff",
//   },
//   menu: {},
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   logo: {
//     height: 400,
//     alignSelf: "center",
//     marginBottom: 0,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 12,
//   },
//   button: {
//     backgroundColor: "#007bff",
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
//   link: { color: "#007bff", textAlign: "center", marginTop: 10 },
// });

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

  // buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  link: { color: "#007bff", textAlign: "center", marginTop: 10 },
});
