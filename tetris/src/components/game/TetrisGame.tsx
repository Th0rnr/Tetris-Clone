/*"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTetris } from "@/hooks/useTetris";
import GameBoard from "./gameBoard";
import GameStatus from "./GameStatus";
import UpcomingBlocks from "./UpcomingBlocks";
import ScoreBoard from "./ScoreBoard";
import { startGameSession, endGameSession } from "@/app/helper/gameActions";
import type { GameSessionStats } from "@/types/index";

const TetrisGame = () => {
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Prevent arrow keys from scrolling the page
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
      ) {
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        if (data.user) {
          setUserId(data.user.id);
        }
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
        const gameStats: GameSessionStats = {
          score: stats.score,
          linesCleared: stats.linesCleared,
          level: stats.level,
          tetrisCount: stats.tetrisCount,
          isPerfectClear: stats.isPerfectClear,
        };

        const result = await endGameSession(currentSessionId, gameStats);

        if (!result.success) {
          throw new Error("Failed to end game session");
        }

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
    const sessionStarted = await handleGameStart();
    if (sessionStarted) {
      startGame();
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-start gap-8 p-4 min-h-screen bg-gray-900">
      {error && (
        <div className="absolute top-4 right-4 bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded">
          {error}
        </div>
      )}

      <div className="hidden md:flex flex-col gap-6">
        <ScoreBoard score={score} level={level} linesCleared={linesCleared} />
      </div>

      <div className="relative">
        <GameBoard board={board} />
        <GameStatus
          isPlaying={isPlaying}
          isPaused={isPaused}
          score={score}
          onStart={handleStartGame}
        />
      </div>

      <div className="hidden md:flex flex-col gap-6">
        <UpcomingBlocks blocks={upcomingBlocks} />
        {isPlaying && (
          <div className="text-center text-sm text-gray-400 bg-gray-800/50 rounded-lg px-3 py-2">
            Press ESC to {isPaused ? "resume" : "pause"}
          </div>
        )}
      </div>
    </div>
  );
};

export default TetrisGame;*/

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTetris } from "@/hooks/useTetris";
import GameBoard from "./gameBoard";
import GameStatus from "./GameStatus";
import UpcomingBlocks from "./UpcomingBlocks";
import ScoreBoard from "./ScoreBoard";
import AchievementPopup from "./AchievementPopup";
import { startGameSession, endGameSession } from "@/app/helper/gameActions";
import type { GameSessionStats } from "@/types/index";
import type { ClientAchievement } from "@/types/achievements";

interface GameResults {
  isNewHighScore: boolean;
  newAchievements: ClientAchievement[];
  totalReward: number;
}

const TetrisGame = () => {
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [gameResults, setGameResults] = useState<GameResults | undefined>(
    undefined
  );
  const [currentAchievement, setCurrentAchievement] =
    useState<ClientAchievement | null>(null);
  const [achievementQueue, setAchievementQueue] = useState<ClientAchievement[]>(
    []
  );

  // Handle achievement queue
  useEffect(() => {
    if (achievementQueue.length > 0 && !currentAchievement) {
      const nextAchievement = achievementQueue[0];
      setCurrentAchievement(nextAchievement);

      const timer = setTimeout(() => {
        setCurrentAchievement(null);
        setAchievementQueue((prev) => prev.slice(1));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [achievementQueue, currentAchievement]);

  // Check for achievements during gameplay
  const checkAchievements = useCallback(
    async (stats: GameSessionStats) => {
      if (!currentSessionId || !userId) return;

      try {
        const response = await fetch("/api/achievements/check", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            sessionId: currentSessionId,
            stats,
          }),
        });

        if (!response.ok) return;

        const result = await response.json();
        if (result.newAchievements?.length > 0) {
          setAchievementQueue((prev) => [...prev, ...result.newAchievements]);
        }
      } catch (error) {
        console.error("Error checking achievements:", error);
      }
    },
    [currentSessionId, userId]
  );

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
        if (data.user) {
          setUserId(data.user.id);
        }
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
      setGameResults(undefined);
      setAchievementQueue([]);
      setCurrentAchievement(null);

      const result = await startGameSession(userId);
      if (result.success && result.sessionId) {
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
        const result = await endGameSession(currentSessionId, stats);

        if (!result.success) {
          throw new Error(result.error || "Failed to end game session");
        }

        const currentHighScore = result.session?.score ?? 0;

        setGameResults({
          isNewHighScore: stats.score > currentHighScore,
          newAchievements: result.newAchievements ?? [],
          totalReward: result.totalReward ?? 0,
        });

        // Queue any final achievements
        if (result.newAchievements?.length) {
          setAchievementQueue((prev) => [...prev, ...result.newAchievements]);
        }

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
  } = useTetris((stats) => {
    // Check for achievements during gameplay
    if (isPlaying && !isPaused) {
      checkAchievements(stats);
    }
    // Handle game over
    if (!isPlaying) {
      handleGameOver(stats);
    }
  });

  const handleStartGame = async () => {
    const sessionStarted = await handleGameStart();
    if (sessionStarted) {
      startGame();
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-center items-start gap-8 p-4 min-h-screen bg-gray-900">
        {error && (
          <div className="absolute top-4 right-4 bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded">
            {error}
          </div>
        )}

        <div className="hidden md:flex flex-col gap-6">
          <ScoreBoard score={score} level={level} linesCleared={linesCleared} />
        </div>

        <div className="relative">
          <GameBoard board={board} />
          <GameStatus
            isPlaying={isPlaying}
            isPaused={isPaused}
            score={score}
            onStart={handleStartGame}
            gameResults={gameResults}
          />
        </div>

        <div className="hidden md:flex flex-col gap-6">
          <UpcomingBlocks blocks={upcomingBlocks} />
          {isPlaying && (
            <div className="text-center text-sm text-gray-400 bg-gray-800/50 rounded-lg px-3 py-2">
              Press ESC to {isPaused ? "resume" : "pause"}
            </div>
          )}
        </div>
      </div>
      <AchievementPopup achievement={currentAchievement} />
    </>
  );
};

export default TetrisGame;
