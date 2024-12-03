"use server";

import { prisma } from "@/utils/PrismaClient";
import { GameStats, Achievement, ACHIEVEMENTS } from "@/types/achievements";

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

export async function getUserAchievements(userId: string) {
  try {
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
    });

    return userAchievements.map((ua) => ({
      ...ACHIEVEMENTS.find((a) => a.id === ua.achievementId)!,
      unlockedAt: ua.unlockedAt,
    }));
  } catch (error) {
    console.error("Error fetching user achievements:", error);
    throw error;
  }
}

async function updateStats(userId: string, gameStats: Partial<GameStats>) {
  try {
    const currentStats = await getUserStats(userId);

    return await prisma.gameStats.update({
      where: { userId },
      data: {
        totalScore: currentStats.totalScore + (gameStats.totalScore || 0),
        highestScore: Math.max(
          currentStats.highestScore,
          gameStats.highestScore || 0
        ),
        totalLinesCleared:
          currentStats.totalLinesCleared + (gameStats.totalLinesCleared || 0),
        maxLinesInOneGame: Math.max(
          currentStats.maxLinesInOneGame,
          gameStats.maxLinesInOneGame || 0
        ),
        gamesPlayed: currentStats.gamesPlayed + (gameStats.gamesPlayed ? 1 : 0),
        tetrisCount: currentStats.tetrisCount + (gameStats.tetrisCount || 0),
        maxLevel: Math.max(currentStats.maxLevel, gameStats.maxLevel || 0),
        perfectClearCount:
          currentStats.perfectClearCount + (gameStats.perfectClearCount || 0),
      },
    });
  } catch (error) {
    console.error("Error updating stats:", error);
    throw error;
  }
}

async function checkAndUnlockAchievements(userId: string) {
  try {
    const stats = await getUserStats(userId);
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      select: { achievementId: true },
    });
    const unlockedIds = new Set(userAchievements.map((ua) => ua.achievementId));

    let totalReward = 0;
    const newlyUnlocked: Achievement[] = [];
    for (const achievement of ACHIEVEMENTS) {
      if (!unlockedIds.has(achievement.id) && achievement.condition(stats)) {
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
        newlyUnlocked.push(achievement);
      }
    }

    // If there were rewards, update the user's score
    if (totalReward > 0) {
      await updateStats(userId, { totalScore: totalReward });
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

export async function trackGameEnd(userId: string, gameStats: GameStats) {
  try {
    await updateStats(userId, gameStats);
    return await checkAndUnlockAchievements(userId);
  } catch (error) {
    console.error("Error tracking game end:", error);
    throw error;
  }
}
