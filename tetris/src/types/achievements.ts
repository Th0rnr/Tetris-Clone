export enum AchievementCategory {
  SCORE = "SCORE",
  LINES = "LINES",
  SPEED = "SPEED",
  SPECIAL = "SPECIAL",
}

export interface GameStats {
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

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-game",
    title: "First Steps",
    description: "Play your first game of Tetris",
    icon: "Play",
    category: AchievementCategory.SPECIAL,
    condition: (stats) => stats.gamesPlayed >= 1,
    reward: 100,
  },
  {
    id: "score-1000",
    title: "Point Collector",
    description: "Score 1,000 points in a single game",
    icon: "Target",
    category: AchievementCategory.SCORE,
    condition: (stats) => stats.highestScore >= 1000,
    progress: (stats) => Math.min((stats.highestScore / 1000) * 100, 100),
    reward: 200,
  },
  {
    id: "tetris-master",
    title: "Tetris Master",
    description: "Clear 4 lines at once (Tetris)",
    icon: "Zap",
    category: AchievementCategory.LINES,
    condition: (stats) => stats.tetrisCount >= 1,
    reward: 500,
  },
  {
    id: "speed-demon",
    title: "Speed Demon",
    description: "Reach level 10",
    icon: "Gauge",
    category: AchievementCategory.SPEED,
    condition: (stats) => stats.maxLevel >= 10,
    progress: (stats) => (stats.maxLevel / 10) * 100,
    reward: 1000,
  },
  {
    id: "perfect-clear",
    title: "Perfect Clear",
    description: "Clear the entire board",
    icon: "Sparkles",
    category: AchievementCategory.SPECIAL,
    condition: (stats) => stats.perfectClearCount >= 1,
    reward: 2000,
    secret: true,
  },
];
