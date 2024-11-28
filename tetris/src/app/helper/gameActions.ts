"use server";

import { gameSessionController } from "@/app/controllers/gameSessionController";

export async function startGameSession(userId: string) {
  console.log("Starting game session for user:", userId);

  if (!userId) {
    console.error("No userId provided to startGameSession");
    return { success: false, error: "No userId provided" };
  }

  try {
    const result = await gameSessionController.startSession(userId);
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

export async function endGameSession(sessionId: number, finalScore: number) {
  try {
    return await gameSessionController.endSession(sessionId, finalScore);
  } catch (error) {
    console.error("Error ending game session:", error);
    throw error;
  }
}
