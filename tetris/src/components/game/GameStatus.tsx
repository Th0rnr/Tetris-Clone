"use client";

import React, { useState, useEffect } from "react";
import { Trophy } from "lucide-react";
import type { ClientAchievement } from "@/types/achievements";

interface GameStatusProps {
  isPlaying: boolean;
  isPaused: boolean;
  score: number;
  onStart: () => void;
  newAchievements?: ClientAchievement[];
  isNewHighScore?: boolean;
  isLoadingGameOver: boolean;
}

const GameStatus: React.FC<GameStatusProps> = ({
  isPlaying,
  isPaused,
  score,
  onStart,
  newAchievements = [],
  isNewHighScore = false,
  isLoadingGameOver,
}) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.user && data.user.id) {
          setUserId(data.user.id);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const handleStartGame = async () => {
    if (!userId) {
      console.error("No user ID available");
      return;
    }

    setIsLoading(true);
    try {
      onStart();
    } catch (error) {
      console.error("Full error details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isPlaying) {
    return (
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-gray-900/90 p-8 rounded-xl max-w-sm w-full mx-4 text-center">
          {score > 0 ? (
            <>
              <h2 className="text-3xl font-bold text-white mb-4">Game Over</h2>
              {isLoadingGameOver ? (
                <div className="animate-pulse mb-6">
                  <div className="h-8 bg-gray-700 rounded mb-2"></div>
                  <div className="h-12 bg-gray-700 rounded"></div>
                </div>
              ) : (
                <div className="mb-6">
                  <p className="text-gray-400 mb-2">
                    {isNewHighScore ? "New High Score!" : "Final Score"}
                  </p>
                  <p className="text-4xl font-bold text-yellow-400">
                    {score.toLocaleString()}
                  </p>
                </div>
              )}

              {!isLoadingGameOver && newAchievements.length > 0 && (
                <div className="mb-6 border-t border-gray-700 pt-4">
                  <p className="text-gray-400 mb-3">Achievements Unlocked!</p>
                  <div className="space-y-3">
                    {newAchievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="bg-gray-800 rounded-lg p-3 flex items-start gap-3 text-left"
                      >
                        <Trophy className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-medium text-white">
                            {achievement.title}
                          </p>
                          <p className="text-sm text-gray-400">
                            {achievement.description}
                          </p>
                          {achievement.reward && (
                            <p className="text-sm text-yellow-500 mt-1">
                              +{achievement.reward} points
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <h2 className="text-3xl font-bold text-white mb-6">
              <span className="flex justify-center space-x-1">
                <span className="text-blue-500">T</span>
                <span className="text-yellow-400">E</span>
                <span className="text-green-500">T</span>
                <span className="text-red-500">R</span>
                <span className="text-purple-500">I</span>
                <span className="text-orange-500">S</span>
              </span>
            </h2>
          )}

          <button
            onClick={handleStartGame}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {score > 0 ? "Play Again" : "Start Game"}
          </button>

          <div className="mt-8 text-sm text-gray-400">
            <h3 className="font-medium mb-2">Controls</h3>
            <div className="grid grid-cols-2 gap-2 text-left">
              <div>← and →: Move</div>
              <div>↑: Rotate</div>
              <div>↓: Soft Drop</div>
              <div>Space: Hard Drop</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isPlaying && isPaused) {
    return (
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg backdrop-blur-md mt-4">
        <div className="text-center">
          <h3 className="text-white text-lg font-semibold uppercase tracking-wide mb-2">
            Game Paused
          </h3>
          <p className="text-sm text-gray-400">Press ESC to resume</p>
        </div>
      </div>
    );
  }

  return null;
};

export default GameStatus;
