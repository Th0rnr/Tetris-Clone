"use client";

import React from "react";

interface ScoreBoardProps {
  score: number;
  linesCleared: number;
  level: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  linesCleared,
  level,
}) => {
  return (
    <div className="w-full md:w-48 lg:w-64 bg-gray-800 p-4 lg:p-6 rounded-xl shadow-lg backdrop-blur-md">
      <div className="flex flex-row md:flex-col justify-between">
        <div className="flex-1 md:mb-4">
          <h3 className="text-white text-sm md:text-base lg:text-lg font-semibold mb-1 md:mb-2 uppercase tracking-wide">
            Score
          </h3>
          <div className="text-xl md:text-2xl lg:text-4xl font-extrabold text-yellow-400">
            {score.toLocaleString()}
          </div>
        </div>

        <div className="flex-1 md:mb-4 text-center md:text-left">
          <h3 className="text-white text-sm md:text-base lg:text-lg font-semibold mb-1 md:mb-2 uppercase tracking-wide">
            Level
          </h3>
          <div className="text-xl md:text-2xl lg:text-4xl font-extrabold text-blue-400">
            {level}
          </div>
        </div>

        <div className="flex-1 text-right md:text-left">
          <h3 className="text-white text-sm md:text-base lg:text-lg font-semibold mb-1 md:mb-2 uppercase tracking-wide">
            Lines
          </h3>
          <div className="text-xl md:text-2xl lg:text-4xl font-extrabold text-green-400">
            {linesCleared.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
