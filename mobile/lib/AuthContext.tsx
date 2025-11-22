import { createContext, ReactNode, useContext } from "react";
import { api } from "./api/axios";
import { saveToken } from "@/src/utils/secureStore";

type AuthContext = {
  signUp: (email: string, password: string) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
};

const AuthContext = createContext<AuthContext | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const signUp = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/signup", { email, password });
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
    <AuthContext.Provider value={{ signUp, signIn }}>
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
