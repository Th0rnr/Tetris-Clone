export interface User {
  id: string;
  email: string;
  username: string;
  profilePicture?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginResponse {
  user: User;
  error?: string;
}

export interface RegisterResponse {
  success: boolean;
  user: User;
  message: string;
  error?: string;
}

export interface TokenPayload {
  userId: string;
  iat: number;
  exp: number;
}
