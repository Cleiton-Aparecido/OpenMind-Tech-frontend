// app/index.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import LoginScreen from "./screens/LoginScreen";

export default function Index() {
  useEffect(() => {
    // Garante que, a cada reinício, não exista sessão persistida
    AsyncStorage.removeItem("userToken").catch(() => {});
  }, []);

  // Não redireciona mais para (tabs). Sempre mostra o Login.
  return <LoginScreen />;
}
