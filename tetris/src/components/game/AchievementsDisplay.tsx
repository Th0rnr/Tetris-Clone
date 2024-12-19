"use client";

import React from "react";
import type { ClientAchievement, GameStats } from "@/types";
import { Trophy, Layers, Gauge, Sparkles } from "lucide-react";

interface AchievementsDisplayProps {
  achievements: ClientAchievement[];
  stats: GameStats;
}

const categoryIcons = {
  SCORE: Trophy,
  LINES: Layers,
  SPEED: Gauge,
  SPECIAL: Sparkles,
};

const AchievementsDisplay = ({ achievements }: AchievementsDisplayProps) => {
  return (
    <div className="p-4 bg-gray-900">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">
        Achievements
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => {
          const Icon = categoryIcons[achievement.category];
          const isUnlocked = !!achievement.unlockedAt;

          if (achievement.secret && !isUnlocked) return null;

          return (
            <div
              key={achievement.id}
              className={`bg-gray-800 rounded-lg p-4 border-2 ${
                isUnlocked ? "border-yellow-500/50" : "border-gray-700"
              }`}
            >
              <div className="flex items-center gap-3">
                {Icon && (
                  <Icon
                    className={isUnlocked ? "text-yellow-500" : "text-gray-400"}
                    size={24}
                  />
                )}
                <div>
                  <h3
                    className={`font-bold ${
                      isUnlocked ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {achievement.description}
                  </p>
                </div>
              </div>
              {achievement.reward && (
                <div className="mt-2 text-sm text-yellow-500">
                  🏆 {achievement.reward.toLocaleString()} points
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementsDisplay;
