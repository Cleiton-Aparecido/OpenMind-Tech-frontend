// app/(tabs)/_layout.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, Tabs } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";

export default function TabsLayout() {
  const [checking, setChecking] = React.useState(true);
  const [hasToken, setHasToken] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const t = await AsyncStorage.getItem("userToken");
        if (!alive) return;
        setHasToken(!!t);
      } finally {
        if (alive) setChecking(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!hasToken) {
    // sem token? manda pro login
    return <Redirect href="/" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false, // <— esconde "(tabs)/index"
        tabBarStyle: { display: "none" }, // opcional: esconde a barra de abas
      }}
    />
  );
}
