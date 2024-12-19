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
  category: AchievementCategory;
  reward: number;
  secret?: boolean;
  condition: (stats: GameStats) => boolean;
}

export interface ClientAchievement extends Omit<Achievement, "condition"> {
  unlockedAt: Date | null;
}

export interface AchievementUnlockResponse {
  newAchievements: ClientAchievement[];
  totalReward: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Beginner Achievements
  {
    id: "first-game",
    title: "First Steps",
    description: "Play your first game of Tetris",
    category: "SPECIAL",
    reward: 100,
    condition: (stats) => stats.gamesPlayed >= 1,
  },
  {
    id: "score-500",
    title: "Getting Started",
    description: "Score 500 points in total",
    category: "SCORE",
    reward: 100,
    condition: (stats) => stats.totalScore >= 500,
  },
  {
    id: "score-1000",
    title: "Point Collector",
    description: "Score 1,000 points in total",
    category: "SCORE",
    reward: 200,
    condition: (stats) => stats.totalScore >= 1000,
  },
  {
    id: "clear-10-lines",
    title: "Line Clearer",
    description: "Clear 10 lines in total",
    category: "LINES",
    reward: 100,
    condition: (stats) => stats.totalLinesCleared >= 10,
  },
  {
    id: "level-3",
    title: "Speed Apprentice",
    description: "Reach level 3",
    category: "SPEED",
    reward: 200,
    condition: (stats) => stats.maxLevel >= 3,
  },

  // Intermediate Achievements
  {
    id: "score-5000",
    title: "Score Master",
    description: "Score 5,000 points in a single game",
    category: "SCORE",
    reward: 500,
    condition: (stats) => stats.highestScore >= 5000,
  },
  {
    id: "clear-50-lines",
    title: "Line Expert",
    description: "Clear 50 lines in total",
    category: "LINES",
    reward: 300,
    condition: (stats) => stats.totalLinesCleared >= 50,
  },
  {
    id: "level-5",
    title: "Speed Runner",
    description: "Reach level 5",
    category: "SPEED",
    reward: 300,
    condition: (stats) => stats.maxLevel >= 5,
  },
  {
    id: "tetris",
    title: "Tetris!",
    description: "Clear 4 lines at once",
    category: "LINES",
    reward: 500,
    condition: (stats) => stats.tetrisCount >= 1,
  },
  {
    id: "games-10",
    title: "Dedicated Player",
    description: "Play 10 games",
    category: "SPECIAL",
    reward: 300,
    condition: (stats) => stats.gamesPlayed >= 10,
  },

  // Advanced Achievements
  {
    id: "score-10000",
    title: "Score Legend",
    description: "Score 10,000 points in a single game",
    category: "SCORE",
    reward: 1000,
    condition: (stats) => stats.highestScore >= 10000,
  },
  {
    id: "clear-100-lines",
    title: "Line Master",
    description: "Clear 100 lines in total",
    category: "LINES",
    reward: 500,
    condition: (stats) => stats.totalLinesCleared >= 100,
  },
  {
    id: "level-10",
    title: "Speed Demon",
    description: "Reach level 10",
    category: "SPEED",
    reward: 1000,
    condition: (stats) => stats.maxLevel >= 10,
  },
  {
    id: "games-50",
    title: "Veteran Player",
    description: "Play 50 games",
    category: "SPECIAL",
    reward: 500,
    condition: (stats) => stats.gamesPlayed >= 50,
  },
  {
    id: "tetris-3",
    title: "Triple Tetris",
    description: "Clear 4 lines at once three times",
    category: "LINES",
    reward: 800,
    condition: (stats) => stats.tetrisCount >= 3,
  },

  // Expert Achievements
  {
    id: "score-20000",
    title: "Score God",
    description: "Score 20,000 points in a single game",
    category: "SCORE",
    reward: 2000,
    condition: (stats) => stats.highestScore >= 20000,
  },
  {
    id: "clear-500-lines",
    title: "Line God",
    description: "Clear 500 lines in total",
    category: "LINES",
    reward: 1000,
    condition: (stats) => stats.totalLinesCleared >= 500,
  },
  {
    id: "tetris-master",
    title: "Tetris Master",
    description: "Clear 4 lines at once 5 times",
    category: "LINES",
    reward: 1000,
    condition: (stats) => stats.tetrisCount >= 5,
  },
  {
    id: "games-100",
    title: "Tetris Addict",
    description: "Play 100 games",
    category: "SPECIAL",
    reward: 1000,
    condition: (stats) => stats.gamesPlayed >= 100,
  },
  {
    id: "perfect-clear",
    title: "Perfect Clear",
    description: "Clear the entire board",
    category: "SPECIAL",
    reward: 1000,
    condition: (stats) => stats.perfectClearCount >= 1,
  },
];
