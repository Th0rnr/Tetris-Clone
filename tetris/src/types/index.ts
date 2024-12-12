import type { ClientAchievement } from "./achievements";
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

export interface GameStats {
  userId: string;
  totalScore: number;
  highestScore: number;
  totalLinesCleared: number;
  maxLinesInOneGame: number;
  gamesPlayed: number;
  tetrisCount: number;
  maxLevel: number;
  perfectClearCount: number;
}

export interface GameSessionStats {
  score: number;
  linesCleared: number;
  level: number;
  tetrisCount: number;
  isPerfectClear: boolean;
}

export interface GameSession {
  id: number;
  userId: string;
  score: number;
  sessionStart: Date;
  sessionEnd: Date | null;
  linesCleared: number;
  level: number;
  tetrisCount: number;
  isPerfectClear: boolean;
}

export interface GameSessionResponse {
  success: boolean;
  sessionId?: number;
  session?: GameSession;
  message?: string;
  error?: string;
  newAchievements?: ClientAchievement[];
  totalReward?: number;
  isNewHighScore?: boolean;
}

export interface ScoreProps {
  score: number;
  level: number;
  linesCleared: number;
}

export interface AchievementUnlockResponse {
  newAchievements: ClientAchievement[];
  totalReward: number;
}

export interface AchievementProgress {
  achievement: ClientAchievement;
  progress: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
}
