"use server";

import {
  startSession,
  endSession,
} from "@/app/controllers/gameSessionController";
import type { GameSessionResponse, GameSessionStats } from "@/types/index";

export async function startGameSession(
  userId: string
): Promise<GameSessionResponse> {
  if (!userId) {
    return { success: false, error: "No userId provided" };
  }

  try {
    const result = await startSession(userId);
    console.log("Game session result:", result);
    return result;
  } catch (error) {
    console.error("Full error starting game session:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to start game session",
    };
  }
}

export async function endGameSession(
  sessionId: number,
  stats: GameSessionStats
): Promise<GameSessionResponse> {
  if (!sessionId) {
    return { success: false, error: "No sessionId provided" };
  }

  try {
    const result = await endSession(sessionId, stats);
    console.log("End session result:", result);
    return result;
  } catch (error) {
    console.error("Full error ending game session:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to end game session",
    };
  }
}
