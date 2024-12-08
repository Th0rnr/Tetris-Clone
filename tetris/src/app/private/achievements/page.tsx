"use client";

import { useEffect, useState, useMemo } from "react";
import type {
  ClientAchievement,
  GameStats,
  AchievementCategory,
} from "@/types/achievements";
import AchievementsDisplay from "@/components/game/AchievementsDisplay";
import {
  Search,
  Trophy,
  Award,
  Target,
  Timer,
  Layers,
  Zap,
  Crown,
} from "lucide-react";

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<ClientAchievement[]>([]);
  const [stats, setStats] = useState<GameStats | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    AchievementCategory | "ALL"
  >("ALL");

  useEffect(() => {
    if (!initialized) {
      const cachedAchievements = localStorage.getItem("achievements");
      const cachedStats = localStorage.getItem("achievementStats");

      if (cachedAchievements) {
        setAchievements(JSON.parse(cachedAchievements));
      }
      if (cachedStats) {
        setStats(JSON.parse(cachedStats));
      }
      setInitialized(true);
    }
  }, [initialized]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/achievements", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch achievements");
        }

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }

        localStorage.setItem("achievements", JSON.stringify(data.achievements));
        localStorage.setItem("achievementStats", JSON.stringify(data.stats));

        setAchievements(data.achievements);
        setStats(data.stats);
      } catch (err) {
        console.error("Error fetching achievements:", err);
        setError("Failed to load achievements. Please try again later.");
      }
    };

    const lastFetch = localStorage.getItem("lastAchievementFetch");
    const shouldFetch = !lastFetch || Date.now() - parseInt(lastFetch) > 60000;

    if (shouldFetch) {
      fetchData();
      localStorage.setItem("lastAchievementFetch", Date.now().toString());
    }
  }, []);

  const achievementStats = useMemo(() => {
    if (!achievements.length) return null;

    const total = achievements.length;
    const unlocked = achievements.filter((a) => a.unlockedAt).length;
    const points = achievements.reduce(
      (sum, a) => (a.unlockedAt ? sum + (a.reward || 0) : sum),
      0
    );
    const rare = achievements.filter((a) => a.unlockedAt && a.secret).length;

    return { total, unlocked, points, rare };
  }, [achievements]);

  const filteredAchievements = useMemo(() => {
    return achievements.filter((achievement) => {
      const matchesSearch =
        searchQuery === "" ||
        achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        achievement.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "ALL" || achievement.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [achievements, searchQuery, selectedCategory]);

  if (!initialized) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading achievements...</div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-500 text-xl">
          {error || "Failed to load achievements"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      {achievementStats && (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-4">
            <Trophy className="text-yellow-500" size={24} />
            <div>
              <div className="text-gray-400 text-sm">Total Achievements</div>
              <div className="text-white text-xl font-bold">
                {achievementStats.total}
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-4">
            <Award className="text-green-500" size={24} />
            <div>
              <div className="text-gray-400 text-sm">Unlocked</div>
              <div className="text-white text-xl font-bold">
                {achievementStats.unlocked}
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-4">
            <Target className="text-blue-500" size={24} />
            <div>
              <div className="text-gray-400 text-sm">Total Points</div>
              <div className="text-white text-xl font-bold">
                {achievementStats.points}
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-4">
            <Zap className="text-purple-500" size={24} />
            <div>
              <div className="text-gray-400 text-sm">Rare Achievements</div>
              <div className="text-white text-xl font-bold">
                {achievementStats.rare}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-4">
          <Crown className="text-yellow-500" size={24} />
          <div>
            <div className="text-gray-400 text-sm">High Score</div>
            <div className="text-white text-xl font-bold">
              {stats.highestScore.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-4">
          <Timer className="text-green-500" size={24} />
          <div>
            <div className="text-gray-400 text-sm">Total Games</div>
            <div className="text-white text-xl font-bold">
              {stats.gamesPlayed}
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-4">
          <Layers className="text-blue-500" size={24} />
          <div>
            <div className="text-gray-400 text-sm">Total Lines</div>
            <div className="text-white text-xl font-bold">
              {stats.totalLinesCleared.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-4">
          <Target className="text-purple-500" size={24} />
          <div>
            <div className="text-gray-400 text-sm">Perfect Clears</div>
            <div className="text-white text-xl font-bold">
              {stats.perfectClearCount}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search achievements..."
            className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <select
            className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value as AchievementCategory | "ALL")
            }
          >
            <option value="ALL">All Categories</option>
            <option value="SCORE">Score</option>
            <option value="LINES">Lines</option>
            <option value="SPEED">Speed</option>
            <option value="SPECIAL">Special</option>
          </select>
        </div>
      </div>

      <AchievementsDisplay achievements={filteredAchievements} stats={stats} />

      {filteredAchievements.length === 0 && achievements.length > 0 && (
        <div className="text-center text-gray-400 mt-8">
          No achievements found matching your criteria
        </div>
      )}
    </div>
  );
}
