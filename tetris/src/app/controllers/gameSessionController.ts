"use server";

import { prisma } from "@/utils/PrismaClient";
import { highScoreController } from "./highScoreController";
import { trackGameEnd } from "./AchievementController";
import type { GameSessionStats, GameStats } from "@/types/index";

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

    await highScoreController.checkAndUpdateHighScore(
      session.userId,
      stats.score
    );

    const gameStats: GameStats = {
      totalScore: stats.score,
      highestScore: stats.score,
      totalLinesCleared: stats.linesCleared,
      maxLinesInOneGame: stats.linesCleared,
      gamesPlayed: 1,
      tetrisCount: stats.tetrisCount,
      maxLevel: stats.level,
      perfectClearCount: stats.isPerfectClear ? 1 : 0,
    };

    const achievementResult = await trackGameEnd(session.userId, gameStats);

    return {
      success: true,
      session,
      ...achievementResult,
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
