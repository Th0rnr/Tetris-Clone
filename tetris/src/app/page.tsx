"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TetrisBackground from "@/components/ui/Background";

interface HighScore {
  id: number;
  score: number;
  user: {
    username: string;
  };
}

export default function Home() {
  const [highScores, setHighScores] = useState<HighScore[]>([]);

  useEffect(() => {
    const fetchHighScores = async () => {
      try {
        const response = await fetch("/api/highscores?limit=5");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setHighScores(data);
      } catch (error) {
        console.error("Error fetching high scores:", error);
      }
    };

    fetchHighScores();
  }, []);

  return (
    <>
      <TetrisBackground />
      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center mb-12 z-10">
          <h1 className="text-6xl font-bold mb-6">
            <span className="flex justify-center space-x-2">
              <span className="text-blue-500">T</span>
              <span className="text-yellow-400">E</span>
              <span className="text-green-500">T</span>
              <span className="text-red-500">R</span>
              <span className="text-purple-500">I</span>
              <span className="text-orange-500">S</span>
            </span>
          </h1>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto">
            Challenge yourself with the classic puzzle game. Compete with
            players worldwide and climb the leaderboard!
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto z-10">
          <div className="flex-1 bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4">How to Play</h2>
            <div className="space-y-4 text-gray-300">
              <p>Use the following controls:</p>
              <div className="grid grid-cols-2 gap-4 bg-gray-900/50 p-4 rounded-lg">
                <div>← and →: Move</div>
                <div>↑: Rotate</div>
                <div>↓: Soft Drop</div>
                <div>Space: Hard Drop</div>
                <div>ESC: Pause</div>
              </div>
              <div className="mt-6">
                <Link
                  href="/auth/login"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  Start Playing
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:w-96 bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Top Players</h2>
            <div className="space-y-4">
              {highScores.map((score, index) => (
                <div
                  key={score.id}
                  className="flex items-center justify-between bg-gray-900/50 p-3 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`text-lg font-bold ${
                        index === 0
                          ? "text-yellow-400"
                          : index === 1
                          ? "text-gray-300"
                          : index === 2
                          ? "text-orange-400"
                          : "text-gray-500"
                      }`}
                    >
                      #{index + 1}
                    </span>
                    <span className="text-white">{score.user.username}</span>
                  </div>
                  <span className="text-blue-400 font-mono">
                    {score.score.toLocaleString()}
                  </span>
                </div>
              ))}

              {highScores.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                  <p>No high scores yet!</p>
                  <p className="text-sm mt-2">Be the first to set a record!</p>
                </div>
              )}

              <Link
                href="/auth/login"
                className="block text-center text-blue-400 hover:text-blue-300 mt-4"
              >
                View Full Leaderboard
              </Link>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-12 z-10">
          <div className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl text-center">
            <h3 className="text-xl font-bold text-white mb-2">Compete</h3>
            <p className="text-gray-400">
              Challenge players worldwide and climb the global leaderboard
            </p>
          </div>
          <div className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl text-center">
            <h3 className="text-xl font-bold text-white mb-2">
              Track Progress
            </h3>
            <p className="text-gray-400">
              Monitor your improvement with detailed statistics
            </p>
          </div>
          <div className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl text-center">
            <h3 className="text-xl font-bold text-white mb-2">Achievements</h3>
            <p className="text-gray-400">
              Unlock achievements as you master the game
            </p>
          </div>
        </div>

        <div className="mt-12 text-center z-10">
          <Link
            href="/auth/register"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors text-lg"
          >
            Create Account & Play Now
          </Link>
        </div>
      </div>
    </>
  );
}
