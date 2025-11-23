export type User = {
  id: string;
  email: string;
};

export type AuthResponse = {
  success: boolean;
  message: string;
  user: User;
  token: string;
};
