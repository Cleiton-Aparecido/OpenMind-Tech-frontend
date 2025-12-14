import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/env";

type User = {
  id: string;
  name: string;
  email: string;
};

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) return;

        const resp = await fetch(`${BASE_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!resp.ok) return;

        const data = await resp.json();
        setUser(data);
      } catch {
        // opcional: log ou tratamento de erro
      }
    })();
  }, []);

  return user;
}
