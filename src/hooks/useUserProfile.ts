import { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "@/lib/firebase";

interface UserProfile {
  username: string;
  email: string;
  image_url: string | null;
  trc20_address?: string;
}

export function useUserProfile(token: string | null) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("https://collaboo.co/api-user/api/v1/user/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("API Response:", response.data);

        const firebaseUser = auth.currentUser;
        const email = firebaseUser?.email || "unknown@email.com";

        setUserProfile({
          username: response.data.username,
          email: email,
          image_url: response.data.image_url || null,
          trc20_address: response.data.trc20_address || "",
        });
      } catch (error: any) {
        console.error("Ошибка при получении профиля:", error);
        setError(`Ошибка: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token]);

  return { userProfile, loading, error };
}
