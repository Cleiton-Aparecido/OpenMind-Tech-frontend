import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useMemo, useState } from "react";
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

type RootStackParamList = {
  Login:
    | undefined
    | {
        flash?: { type: "success" | "error"; title?: string; message?: string };
      };
  ForgotPassword: undefined;
  Register: undefined;
  Home:
    | {
        flash?: { type: "success" | "error"; title?: string; message?: string };
      }
    | undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

type Props = {
  navigation: LoginScreenNavigationProp;
  route: any;
};

export default function LoginScreen({ navigation, route }: Props) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const [flash, setFlash] = useState<{
    type: "success" | "error";
    title?: string;
    message?: string;
  } | null>(null);

  const baseURL = useMemo(() => {
    if (Platform.OS === "android") return "http://10.0.2.2:3001";
    return "http://localhost:3001";
  }, []);

  useEffect(() => {
    const f = route?.params?.flash;
    if (f) {
      setFlash(f);

      navigation.setParams({ flash: undefined });
    }
  }, [route?.params?.flash, navigation]);

  async function handleLogin() {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha e-mail e senha.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: senha }),
      });

      if (!response.ok) {
        const raw = await response.text();
        let msg: any = "Credenciais inválidas";
        try {
          const data = raw ? JSON.parse(raw) : {};
          msg = data?.message || data?.error || raw || msg;
          if (Array.isArray(msg)) msg = msg[0];
        } catch {}
        throw new Error(
          typeof msg === "string" ? msg : "Credenciais inválidas"
        );
      }

      const data = await response.json();
      await AsyncStorage.setItem("userToken", data?.access_token ?? "");

      navigation.reset({
        index: 0,
        routes: [
          {
            name: "Home",
            params: {
              flash: {
                type: "success",
                title: "Bem-vindo!",
                message: "Login realizado com sucesso.",
              },
            },
          } as any,
        ],
      });
    } catch (err: any) {
      Alert.alert("Erro", err?.message || "Falha no login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.menu}>
        <Image
          source={require("../images/logo.jpeg")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Login</Text>

        {/* Flash message (ex.: “Conta criada!” vindo do Register) */}
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
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          editable={!loading}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
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
  logo: {
    maxHeight: 300,
    width: "80%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
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
