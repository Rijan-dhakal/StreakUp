export type User = {
  id: number;
  email: string;
};

export type AuthResponse = {
  success: boolean;
  message: string;
  user: User;
  token: string;
};
