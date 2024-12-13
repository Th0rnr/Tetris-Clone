"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTetris } from "@/hooks/useTetris";
import GameBoard from "./gameBoard";
import GameStatus from "./GameStatus";
import UpcomingBlocks from "./UpcomingBlocks";
import ScoreBoard from "./ScoreBoard";
import { startGameSession, endGameSession } from "@/app/helper/gameActions";
import type { GameSessionStats } from "@/types/index";
import type { ClientAchievement } from "@/types/achievements";

const TetrisGame = () => {
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newAchievements, setNewAchievements] = useState<ClientAchievement[]>(
    []
  );
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
      ) {
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user", {
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        if (data.user) setUserId(data.user.id);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Failed to authenticate user");
      }
    };

    fetchUser();
  }, []);

  const handleGameStart = async () => {
    if (!userId) {
      setError("User authentication required");
      return false;
    }

    try {
      setError(null);
      const result = await startGameSession(userId);

      if (result.success && typeof result.sessionId === "number") {
        setCurrentSessionId(result.sessionId);
        return true;
      } else {
        throw new Error("Failed to start game session");
      }
    } catch (error) {
      console.error("Error starting game session:", error);
      setError("Failed to start game session");
      return false;
    }
  };

  const handleGameOver = useCallback(
    async (stats: GameSessionStats) => {
      if (!currentSessionId) {
        console.error("No session ID available for game over");
        return;
      }

      try {
        const result = await endGameSession(currentSessionId, {
          score: stats.score,
          linesCleared: stats.linesCleared,
          level: stats.level,
          tetrisCount: stats.tetrisCount,
          isPerfectClear: stats.isPerfectClear,
        });

        if (!result.success) {
          throw new Error("Failed to end game session");
        }

        if (result.newAchievements) {
          setNewAchievements(result.newAchievements);
        }

        setIsNewHighScore(!!result.isNewHighScore);
        setCurrentSessionId(null);
      } catch (error) {
        console.error("Error ending game session:", error);
        setError("Failed to save game results");
      }
    },
    [currentSessionId]
  );

  const {
    board,
    startGame,
    isPlaying,
    isPaused,
    score,
    level,
    linesCleared,
    upcomingBlocks,
  } = useTetris(handleGameOver);

  const handleStartGame = async () => {
    setNewAchievements([]);
    setIsNewHighScore(false);
    const sessionStarted = await handleGameStart();
    if (sessionStarted) {
      startGame();
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-4 md:gap-8 p-4 min-h-screen bg-gray-900">
      {error && (
        <div className="fixed top-4 right-4 bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded">
          {error}
        </div>
      )}

      <div className="w-full md:w-auto flex md:flex-col gap-4">
        <ScoreBoard score={score} level={level} linesCleared={linesCleared} />
        {isPlaying && (
          <div className="text-center text-sm text-gray-400 bg-gray-800/50 rounded-lg px-3 py-2 hidden md:block">
            Press ESC to {isPaused ? "resume" : "pause"}
          </div>
        )}
      </div>

      <div className="relative w-full md:w-auto">
        <GameBoard board={board} />
        <GameStatus
          isPlaying={isPlaying}
          isPaused={isPaused}
          score={score}
          onStart={handleStartGame}
          newAchievements={newAchievements}
          isNewHighScore={isNewHighScore}
        />
      </div>

      <div className="w-full md:w-auto flex md:flex-col gap-4">
        <UpcomingBlocks blocks={upcomingBlocks} />
        {isPlaying && (
          <div className="text-center text-sm text-gray-400 bg-gray-800/50 rounded-lg px-3 py-2 md:hidden">
            Press ESC to {isPaused ? "resume" : "pause"}
          </div>
        )}
      </div>
    </div>
  );
};

export default TetrisGame;
