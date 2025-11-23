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

        console.log("Loaded token:", token);
        const response = await api.get<AuthResponse>("/auth/me");

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
        return response.data.message || "Signup failed";
      }

      const { token, user } = response.data;

      await saveToken("jwt", token);
      setUser(user);

      return null;
    } catch (error: any) {
      console.log("Signup error:", error);

      if (error.code === 'ERR_NETWORK' || !error.response) {
        return "Unable to connect to server. Please check your connection.";
      }

      if (error.response?.status >= 400 && error.response?.status < 500) {
        return error.response?.data?.message || "Invalid email or password";
      }

      if (error.response?.status >= 500) {
        return "Server error. Please try again later.";
      }

      return "An unexpected error occurred during signup";
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post<AuthResponse>("/auth/signin", { 
        email, 
        password 
      });

      if (!response.data.success) {
        return response.data.message || "Signin failed";
      }

      const { token, user } = response.data;

      await saveToken("jwt", token);
      setUser(user);

      return null;

    } catch (error: any) {
      console.log("Signin error:", error);

      if (error.code === 'ERR_NETWORK' || !error.response) {
        return "Unable to connect to server. Please check your connection.";
      }

      if (error.response?.status >= 400 && error.response?.status < 500) {
        return error.response?.data?.message || "Invalid email or password";
      }

      if (error.response?.status >= 500) {
        return "Server error. Please try again later.";
      }

      return "An unexpected error occurred during signin";
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