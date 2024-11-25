"use client";

import React from "react";
import { Block, SHAPES } from "@/types/types";

interface UpcomingBlocksProps {
  blocks: Block[];
}

const UpcomingBlocks: React.FC<UpcomingBlocksProps> = ({ blocks }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg backdrop-blur-md">
      <h3 className="text-white text-lg font-semibold mb-4">Next Pieces</h3>
      <div className="space-y-6">
        {blocks.map((block, index) => (
          <div
            key={index}
            className="flex justify-center items-center h-24 w-24 bg-gray-700 rounded-lg shadow-inner p-2"
          >
            <div
              className="grid gap-1"
              style={{
                gridTemplateColumns: `repeat(${SHAPES[block].shape[0].length}, 1fr)`,
              }}
            >
              {SHAPES[block].shape.map((row, rowIndex) =>
                row.map((isSet, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`w-6 h-6 rounded-md ${
                      isSet ? getBlockColor(block) : "bg-gray-600"
                    }`}
                  >
                    {isSet && (
                      <div className="relative w-full h-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-md" />
                        <div className="absolute inset-0 bg-gradient-to-tl from-black/20 to-transparent rounded-md" />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const getBlockColor = (block: Block) => {
  switch (block) {
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
  }
};

export default UpcomingBlocks;
