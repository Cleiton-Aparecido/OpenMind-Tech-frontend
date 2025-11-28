import { Platform } from "react-native";

const ANDROID_URL = process.env.EXPO_PUBLIC_API_URL;
const IOS_URL = process.env.EXPO_PUBLIC_API_URL;

if (!ANDROID_URL && !IOS_URL) {
  console.warn(
    "⚠️ Defina EXPO_PUBLIC_API_URL_ANDROID/EXPO_PUBLIC_API_URL_IOS no arquivo .env do ambiente."
  );
}

export const BASE_URL =
  Platform.OS === "android"
    ? ANDROID_URL ?? IOS_URL ?? "http://72.61.59.36:3010"
    : IOS_URL ?? ANDROID_URL ?? "http://localhost:3010";
