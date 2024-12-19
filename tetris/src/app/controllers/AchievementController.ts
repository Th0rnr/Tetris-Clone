"use server";

import { prisma } from "@/utils/PrismaClient";
import { ACHIEVEMENTS } from "@/types/achievements";
import type {
  GameStats,
  GameSessionStats,
  ClientAchievement,
  AchievementUnlockResponse,
} from "@/types";

function toGameStats(session: GameSessionStats, userId: string): GameStats {
  return {
    userId,
    totalScore: session.score,
    highestScore: session.score,
    totalLinesCleared: session.linesCleared,
    maxLinesInOneGame: session.linesCleared,
    gamesPlayed: 1,
    tetrisCount: session.tetrisCount,
    maxLevel: session.level,
    perfectClearCount: session.isPerfectClear ? 1 : 0,
  };
}

export async function getUserStats(userId: string): Promise<GameStats> {
  const stats = await prisma.gameStats.findUnique({
    where: { userId },
  });

  if (!stats) {
    return prisma.gameStats.create({
      data: {
        userId,
        totalScore: 0,
        highestScore: 0,
        totalLinesCleared: 0,
        maxLinesInOneGame: 0,
        gamesPlayed: 0,
        tetrisCount: 0,
        maxLevel: 0,
        perfectClearCount: 0,
      },
    });
  }

  return stats;
}

export async function getUserAchievements(
  userId: string
): Promise<ClientAchievement[]> {
  const unlocked = await prisma.userAchievement.findMany({
    where: { userId },
    select: { achievementId: true, unlockedAt: true },
  });

  return ACHIEVEMENTS.map(({ condition, ...achievement }) => ({
    ...achievement,
    unlockedAt:
      unlocked.find((u) => u.achievementId === achievement.id)?.unlockedAt ||
      null,
  }));
}

async function updateStats(
  userId: string,
  gameStats: GameSessionStats
): Promise<GameStats> {
  const currentStats = await getUserStats(userId);

  return prisma.gameStats.update({
    where: { userId },
    data: {
      totalScore: currentStats.totalScore + gameStats.score,
      highestScore: Math.max(currentStats.highestScore, gameStats.score),
      totalLinesCleared:
        currentStats.totalLinesCleared + gameStats.linesCleared,
      maxLinesInOneGame: Math.max(
        currentStats.maxLinesInOneGame,
        gameStats.linesCleared
      ),
      gamesPlayed: currentStats.gamesPlayed + 1,
      tetrisCount: currentStats.tetrisCount + gameStats.tetrisCount,
      maxLevel: Math.max(currentStats.maxLevel, gameStats.level),
      perfectClearCount:
        currentStats.perfectClearCount + (gameStats.isPerfectClear ? 1 : 0),
    },
  });
}

async function checkAndUnlockAchievements(
  userId: string,
  currentGame: GameSessionStats
): Promise<AchievementUnlockResponse> {
  const stats = await getUserStats(userId);
  const unlocked = await prisma.userAchievement.findMany({
    where: { userId },
    select: { achievementId: true },
  });

  const unlockedIds = new Set(unlocked.map((u) => u.achievementId));
  const newlyUnlocked: ClientAchievement[] = [];
  let totalReward = 0;

  const currentGameStats = toGameStats(currentGame, userId);

  for (const { condition, ...achievement } of ACHIEVEMENTS) {
    if (!unlockedIds.has(achievement.id)) {
      const conditionMet = achievement.id.startsWith("game_")
        ? condition(currentGameStats)
        : condition(stats);

      if (conditionMet) {
        const unlockedAt = new Date();
        await prisma.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id,
            unlockedAt,
          },
        });

        totalReward += achievement.reward;
        newlyUnlocked.push({ ...achievement, unlockedAt });
      }
    }
  }

  if (totalReward > 0) {
    await prisma.gameStats.update({
      where: { userId },
      data: {
        totalScore: stats.totalScore + totalReward,
      },
    });
  }

  return { newAchievements: newlyUnlocked, totalReward };
}

export async function trackGameEnd(
  userId: string,
  sessionStats: GameSessionStats
): Promise<AchievementUnlockResponse> {
  await updateStats(userId, sessionStats);
  return checkAndUnlockAchievements(userId, sessionStats);
}
