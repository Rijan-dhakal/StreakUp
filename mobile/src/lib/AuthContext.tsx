import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "./api/axios";
import { getToken, removeToken, saveToken } from "@/src/utils/secureStore";
import { AuthResponse, User } from "../types/auth";

type AuthContext = {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
};

const AuthContext = createContext<AuthContext | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await getToken("jwt");

        if (!token) {
          setLoading(false);
          return;
        }

        const response = await api.get<AuthResponse>("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setUser(response.data.user);
        } else {
          await removeToken("jwt");
        }
      } catch (error) {
        await removeToken("jwt");
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const response = await api.post<AuthResponse>("/auth/signup", {
        email,
        password,
      });
      if (!response.data.success) {
        return response.data.message;
      }
      const { token, user } = response.data;

      await saveToken("jwt", token);
      setUser(user);

      return null;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }

      return "An error occured during signup";
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/signin", { email, password });
      const { token } = response.data;

      await saveToken("jwt", token);

      return null;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }

      return "An error occured during signup";
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
