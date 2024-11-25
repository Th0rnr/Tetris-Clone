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
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg backdrop-blur-md">
      <div className="mb-6">
        <h3 className="text-white text-lg font-semibold mb-4 uppercase tracking-wide">
          Score
        </h3>
        <div className="text-4xl font-extrabold text-yellow-400 drop-shadow-md">
          {score.toLocaleString()}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-white text-lg font-semibold mb-4 uppercase tracking-wide">
          Level
        </h3>
        <div className="text-4xl font-extrabold text-blue-400 drop-shadow-md">
          {level}
        </div>
      </div>

      <div>
        <h3 className="text-white text-lg font-semibold mb-4 uppercase tracking-wide">
          Lines
        </h3>
        <div className="text-4xl font-extrabold text-green-400 drop-shadow-md">
          {linesCleared.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
