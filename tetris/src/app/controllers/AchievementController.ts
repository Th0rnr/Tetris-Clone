"use server";

import { prisma } from "@/utils/PrismaClient";
import {
  GameStats,
  GameSessionStats,
  AchievementUnlockResponse,
} from "@/types/index";
import { Achievement, ACHIEVEMENTS } from "@/types/achievements";
import type { ClientAchievement } from "@/types/achievements";

interface UserAchievement {
  userId: string;
  achievementId: string;
  unlockedAt: Date;
}

function toClientAchievement(achievement: Achievement): ClientAchievement {
  const { condition, ...clientAchievement } = achievement;
  return clientAchievement;
}

function convertSessionToGameStats(
  session: GameSessionStats,
  userId: string
): GameStats {
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
  try {
    const stats = await prisma.gameStats.findUnique({
      where: { userId },
    });

    if (!stats) {
      return await prisma.gameStats.create({
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
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
}

export async function getUserAchievements(
  userId: string
): Promise<ClientAchievement[]> {
  try {
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
    });

    return userAchievements.map((ua: UserAchievement) => {
      const achievement = ACHIEVEMENTS.find((a) => a.id === ua.achievementId);
      if (!achievement) {
        throw new Error(`Achievement ${ua.achievementId} not found`);
      }
      return {
        ...toClientAchievement(achievement),
        unlockedAt: ua.unlockedAt,
      };
    });
  } catch (error) {
    console.error("Error fetching user achievements:", error);
    throw error;
  }
}

async function updateStats(
  userId: string,
  currentGame: GameSessionStats
): Promise<GameStats> {
  try {
    const currentStats = await getUserStats(userId);

    return await prisma.gameStats.update({
      where: { userId },
      data: {
        totalScore: currentStats.totalScore + currentGame.score,
        highestScore: Math.max(currentStats.highestScore, currentGame.score),
        totalLinesCleared:
          currentStats.totalLinesCleared + currentGame.linesCleared,
        maxLinesInOneGame: Math.max(
          currentStats.maxLinesInOneGame,
          currentGame.linesCleared
        ),
        gamesPlayed: currentStats.gamesPlayed + 1,
        tetrisCount: currentStats.tetrisCount + currentGame.tetrisCount,
        maxLevel: Math.max(currentStats.maxLevel, currentGame.level),
        perfectClearCount:
          currentStats.perfectClearCount + (currentGame.isPerfectClear ? 1 : 0),
      },
    });
  } catch (error) {
    console.error("Error updating stats:", error);
    throw error;
  }
}

interface UserAchievementSelect {
  achievementId: string;
}

async function checkAndUnlockAchievements(
  userId: string,
  currentGame: GameSessionStats
): Promise<AchievementUnlockResponse> {
  try {
    const stats = await getUserStats(userId);
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      select: { achievementId: true },
    });

    const unlockedIds = new Set(
      userAchievements.map((ua: UserAchievementSelect) => ua.achievementId)
    );
    let totalReward = 0;
    const newlyUnlocked: ClientAchievement[] = [];

    const currentGameStats = convertSessionToGameStats(currentGame, userId);

    for (const achievement of ACHIEVEMENTS) {
      if (unlockedIds.has(achievement.id)) {
        continue;
      }

      let conditionMet = false;
      try {
        conditionMet = achievement.condition(
          achievement.id.startsWith("game_") ? currentGameStats : stats
        );
      } catch (error) {
        console.error(
          `Error checking condition for achievement ${achievement.id}:`,
          error
        );
        continue;
      }

      if (conditionMet) {
        await prisma.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id,
            unlockedAt: new Date(),
          },
        });

        if (achievement.reward) {
          totalReward += achievement.reward;
        }

        const clientAchievement = toClientAchievement(achievement);
        clientAchievement.unlockedAt = new Date();
        newlyUnlocked.push(clientAchievement);
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

    return {
      newAchievements: newlyUnlocked,
      totalReward,
    };
  } catch (error) {
    console.error("Error checking achievements:", error);
    throw error;
  }
}

export async function trackGameEnd(
  userId: string,
  sessionStats: GameSessionStats
): Promise<AchievementUnlockResponse> {
  try {
    await updateStats(userId, sessionStats);
    return await checkAndUnlockAchievements(userId, sessionStats);
  } catch (error) {
    console.error("Error tracking game end:", error);
    throw error;
  }
}
