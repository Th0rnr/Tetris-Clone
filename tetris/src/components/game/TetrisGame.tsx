"use client";

import React, { useCallback } from "react";
import { useTetris } from "@/hooks/useTetris";
import GameBoard from "./gameBoard";
import GameStatus from "./GameStatus";
import UpcomingBlocks from "./UpcomingBlocks";
import ScoreBoard from "./ScoreBoard";

const TetrisGame = () => {
  const handleGameOver = useCallback(() => {
    console.log("Game Over");
  }, []);

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

  return (
    <div className="flex flex-col md:flex-row justify-center items-start gap-8 p-4 min-h-screen bg-gray-900">
      <div className="hidden md:flex flex-col gap-6">
        <ScoreBoard score={score} level={level} linesCleared={linesCleared} />
      </div>

      <div className="relative">
        <GameBoard board={board} />
        <GameStatus
          isPlaying={isPlaying}
          isPaused={isPaused}
          score={score}
          onStart={startGame}
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

export default TetrisGame;
