"use client";

import React from "react";
import { BoardShape, Block, GhostBlock, EmptyCell } from "@/types/types";

interface GameBoardProps {
  board: BoardShape;
}

const GameBoard: React.FC<GameBoardProps> = ({ board }) => {
  const getBlockColor = (cell: Block | GhostBlock | EmptyCell) => {
    switch (cell) {
      case Block.I:
        return "bg-cyan-500";
      case Block.J:
        return "bg-blue-500";
      case Block.L:
        return "bg-orange-500";
      case Block.O:
        return "bg-yellow-500";
      case Block.S:
        return "bg-green-500";
      case Block.T:
        return "bg-purple-500";
      case Block.Z:
        return "bg-red-500";
      case GhostBlock.IGhost:
        return "bg-cyan-500/30";
      case GhostBlock.JGhost:
        return "bg-blue-500/30";
      case GhostBlock.LGhost:
        return "bg-orange-500/30";
      case GhostBlock.OGhost:
        return "bg-yellow-500/30";
      case GhostBlock.SGhost:
        return "bg-green-500/30";
      case GhostBlock.TGhost:
        return "bg-purple-500/30";
      case GhostBlock.ZGhost:
        return "bg-red-500/30";
      default:
        return "bg-gray-800";
    }
  };

  return (
    <div className="bg-gray-900/60 p-4 rounded-xl backdrop-blur-md border border-gray-700 shadow-lg">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`
                w-9 h-9
                ${getBlockColor(cell)}
                border border-gray-600
                rounded-md
                shadow-sm
                relative
              `}
            >
              {cell !== EmptyCell.Empty && (
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10" />
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
