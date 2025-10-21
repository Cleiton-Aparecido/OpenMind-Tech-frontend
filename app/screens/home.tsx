// app/screens/home.tsx
import { useTheme } from "@react-navigation/native";
import React from "react";
import { Text, View } from "react-native";

export default function Home() {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: colors.text, fontSize: 20, fontWeight: "600" }}>
        tela de home page
      </Text>
    </View>
  );
}
