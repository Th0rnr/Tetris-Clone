export type AchievementCategory = "SCORE" | "LINES" | "SPEED" | "SPECIAL";

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

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  condition: (stats: GameStats) => boolean;
  progress?: (stats: GameStats) => number;
  reward?: number;
  secret?: boolean;
}

// Client-side achievement type without functions
export interface ClientAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  reward?: number;
  secret?: boolean;
  unlockedAt?: Date;
}

// Achievement definitions
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-game",
    title: "First Steps",
    description: "Play your first game of Tetris",
    icon: "Play",
    category: "SPECIAL",
    condition: (stats: GameStats) => stats.gamesPlayed >= 1,
    reward: 100,
  },
  {
    id: "score-1000",
    title: "Point Collector",
    description: "Score 1,000 points in total",
    icon: "Target",
    category: "SCORE",
    condition: (stats: GameStats) => stats.totalScore >= 1000,
    progress: (stats: GameStats) =>
      Math.min((stats.totalScore / 1000) * 100, 100),
    reward: 200,
  },
  {
    id: "score-5000",
    title: "Score Master",
    description: "Score 5,000 points in a single game",
    icon: "Award",
    category: "SCORE",
    condition: (stats: GameStats) => stats.highestScore >= 5000,
    progress: (stats: GameStats) =>
      Math.min((stats.highestScore / 5000) * 100, 100),
    reward: 500,
  },
  {
    id: "score-10000",
    title: "Score Legend",
    description: "Score 10,000 points in a single game",
    icon: "Trophy",
    category: "SCORE",
    condition: (stats: GameStats) => stats.highestScore >= 10000,
    progress: (stats: GameStats) =>
      Math.min((stats.highestScore / 10000) * 100, 100),
    reward: 1000,
  },
  {
    id: "clear-10-lines",
    title: "Line Clearer",
    description: "Clear 10 lines in total",
    icon: "MinusSquare",
    category: "LINES",
    condition: (stats: GameStats) => stats.totalLinesCleared >= 10,
    progress: (stats: GameStats) =>
      Math.min((stats.totalLinesCleared / 10) * 100, 100),
    reward: 100,
  },
  {
    id: "clear-100-lines",
    title: "Line Master",
    description: "Clear 100 lines in total",
    icon: "Layers",
    category: "LINES",
    condition: (stats: GameStats) => stats.totalLinesCleared >= 100,
    progress: (stats: GameStats) =>
      Math.min((stats.totalLinesCleared / 100) * 100, 100),
    reward: 500,
  },
  {
    id: "tetris",
    title: "Tetris!",
    description: "Clear 4 lines at once",
    icon: "Zap",
    category: "LINES",
    condition: (stats: GameStats) => stats.tetrisCount >= 1,
    reward: 500,
  },
  {
    id: "perfect-clear",
    title: "Perfect Clear",
    description: "Clear the entire board",
    icon: "Sparkles",
    category: "SPECIAL",
    condition: (stats: GameStats) => stats.perfectClearCount >= 1,
    reward: 1000,
    secret: true,
  },
  {
    id: "level-5",
    title: "Speed Runner",
    description: "Reach level 5",
    icon: "Gauge",
    category: "SPEED",
    condition: (stats: GameStats) => stats.maxLevel >= 5,
    progress: (stats: GameStats) => Math.min((stats.maxLevel / 5) * 100, 100),
    reward: 300,
  },
  {
    id: "level-10",
    title: "Speed Demon",
    description: "Reach level 10",
    icon: "Gauge",
    category: "SPEED",
    condition: (stats: GameStats) => stats.maxLevel >= 10,
    progress: (stats: GameStats) => Math.min((stats.maxLevel / 10) * 100, 100),
    reward: 1000,
  },
];
