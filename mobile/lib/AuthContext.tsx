import { createContext, ReactNode } from "react";
import { User } from "@/src/types/user";
import { api } from "./api/axios";
import { saveToken } from "@/src/utils/secureStore";

type AuthContext = {
  //   user: User | null;
  signUp: (email: string, password: string) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
};

const AuthContext = createContext<AuthContext | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const signUp = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/signup", { email, password });
      const { user, token } = response.data;

      await saveToken("jwt", token);

      //navigate to dashboard

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
      const response = api.post("/auth/signin", { email, password });

      // navigate to dashboard

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
