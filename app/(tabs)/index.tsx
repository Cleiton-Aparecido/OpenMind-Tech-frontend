// Em navigation/AuthStack.js

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
// import LoginScreen from "./screens/LoginScreen";

// Cria o navegador de pilha
const Stack = createNativeStackNavigator();

// O componente exporta APENAS o navegador, SEM o <NavigationContainer>
export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}
