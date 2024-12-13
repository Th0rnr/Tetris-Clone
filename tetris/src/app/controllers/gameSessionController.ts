"use server";

import { prisma } from "@/utils/PrismaClient";
import { checkAndUpdateHighScore } from "./highScoreController";
import { trackGameEnd } from "./AchievementController";
import type { GameSessionStats } from "@/types/index";

export async function startSession(userId: string) {
  try {
    const session = await prisma.gameSession.create({
      data: {
        userId,
        score: 0,
        linesCleared: 0,
        level: 1,
        tetrisCount: 0,
        isPerfectClear: false,
      },
    });

    return {
      success: true,
      sessionId: session.id,
      message: "Game session started",
    };
  } catch (error) {
    console.error("Error starting game session:", error);
    throw error;
  }
}

export async function endSession(sessionId: number, stats: GameSessionStats) {
  try {
    const session = await prisma.gameSession.update({
      where: { id: sessionId },
      data: {
        sessionEnd: new Date(),
        score: stats.score,
        linesCleared: stats.linesCleared,
        level: stats.level,
        tetrisCount: stats.tetrisCount,
        isPerfectClear: stats.isPerfectClear,
      },
    });

    const highScoreResult = await checkAndUpdateHighScore(
      session.userId,
      stats.score
    );
    const achievements = await trackGameEnd(session.userId, stats);

    return {
      success: true,
      session,
      newAchievements: achievements.newAchievements,
      totalReward: achievements.totalReward,
      isNewHighScore: highScoreResult.isNewHighScore,
      message: "Game session ended",
    };
  } catch (error) {
    console.error("Error ending game session:", error);
    throw error;
  }
}

export async function getSessionsByUser(userId: string) {
  try {
    return await prisma.gameSession.findMany({
      where: { userId },
      orderBy: { sessionStart: "desc" },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    throw error;
  }
}

export async function getRecentGames(limit: number = 5) {
  try {
    return await prisma.gameSession.findMany({
      take: limit,
      orderBy: { sessionStart: "desc" },
      where: {
        sessionEnd: { not: null },
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching recent games:", error);
    throw error;
  }
}
