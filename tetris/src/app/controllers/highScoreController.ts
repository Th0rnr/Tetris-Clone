import { prisma } from "@/utils/PrismaClient";

export class highScoreController {
  static async createHighScore(userId: string, score: number) {
    try {
      const highScore = await prisma.highScore.create({
        data: {
          userId,
          score,
        },
      });

      return {
        success: true,
        highScore,
        message: "High score recorded",
      };
    } catch (error) {
      console.error("Error creating high score:", error);
      throw error;
    }
  }

  static async getTopScores(limit: number = 10) {
    try {
      return await prisma.highScore.findMany({
        take: limit,
        orderBy: { score: "desc" },
        include: {
          user: {
            select: {
              username: true,
            },
          },
        },
      });
    } catch (error) {
      console.error("Error fetching top scores:", error);
      throw error;
    }
  }

  static async getUserHighScore(userId: string) {
    try {
      return await prisma.highScore.findFirst({
        where: { userId },
        orderBy: { score: "desc" },
      });
    } catch (error) {
      console.error("Error fetching user high score:", error);
      throw error;
    }
  }

  static async checkAndUpdateHighScore(userId: string, score: number) {
    try {
      const currentHighScore = await this.getUserHighScore(userId);

      if (!currentHighScore || score > currentHighScore.score) {
        const newHighScore = await this.createHighScore(userId, score);
        return {
          success: true,
          isNewHighScore: true,
          highScore: newHighScore,
        };
      }

      return {
        success: true,
        isNewHighScore: false,
        highScore: currentHighScore,
      };
    } catch (error) {
      console.error("Error checking/updating high score:", error);
      throw error;
    }
  }
}

export default highScoreController;
