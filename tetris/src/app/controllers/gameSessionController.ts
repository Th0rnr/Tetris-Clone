import { prisma } from "@/utils/PrismaClient";
import { highScoreController } from "./highScoreController";

export class gameSessionController {
  static async startSession(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return {
          success: false,
          error: "User not found",
        };
      }

      const session = await prisma.gameSession.create({
        data: {
          userId,
          score: 0,
        },
      });

      console.log("Created session:", session);

      return {
        success: true,
        sessionId: session.id,
        message: "Game session started",
      };
    } catch (error) {
      console.error("Error details:", error);
      throw error;
    }
  }

  static async endSession(sessionId: number, finalScore: number) {
    try {
      console.log("Ending session:", sessionId, "with score:", finalScore);

      const session = await prisma.gameSession.update({
        where: { id: sessionId },
        data: {
          sessionEnd: new Date(),
          score: finalScore,
        },
      });

      console.log("Updated session:", session);

      // Check and update high score
      const highScoreResult = await highScoreController.checkAndUpdateHighScore(
        session.userId,
        finalScore
      );

      console.log("High score result:", highScoreResult);

      return {
        success: true,
        session,
        message: "Game session ended",
        highScoreResult,
      };
    } catch (error) {
      console.error("Error ending game session:", error);
      throw error;
    }
  }
}

export default gameSessionController;
