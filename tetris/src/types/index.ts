import type { Achievement } from "./achievements";
export * from "./achievements";

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

export interface GameSessionStats {
  score: number;
  linesCleared: number;
  level: number;
  tetrisCount: number;
  isPerfectClear: boolean;
}

export interface GameSessionResponse {
  success: boolean;
  sessionId?: number;
  session?: {
    id: number;
    userId: string;
    score: number;
    sessionStart: Date;
    sessionEnd: Date | null;
    linesCleared: number;
    level: number;
    tetrisCount: number;
    isPerfectClear: boolean;
  };
  message?: string;
  error?: string;
  newAchievements?: Achievement[];
  totalReward?: number;
}

export interface ScoreProps {
  score: number;
  level: number;
  linesCleared: number;
}

export interface AchievementUnlockResponse {
  newAchievements: Achievement[];
  totalReward: number;
}

export interface AchievementProgress {
  achievement: Achievement;
  progress: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
}
