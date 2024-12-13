import React from "react";
import { Block, SHAPES } from "@/types/types";

interface UpcomingBlocksProps {
  blocks: Block[];
}

const UpcomingBlocks: React.FC<UpcomingBlocksProps> = ({ blocks }) => {
  return (
    <div className="w-full md:w-48 lg:w-64 bg-gray-800 p-4 lg:p-6 rounded-xl shadow-lg backdrop-blur-md">
      <h3 className="text-white text-sm md:text-base lg:text-lg font-semibold mb-2 md:mb-4">
        Next Pieces
      </h3>
      <div className="flex flex-row md:flex-col justify-evenly md:justify-start md:space-y-4">
        {blocks.map((block, index) => (
          <div
            key={index}
            className="flex justify-center items-center h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 bg-gray-700/50 rounded-lg shadow-inner p-1 lg:p-2"
          >
            <div
              className="grid gap-0.5 lg:gap-1"
              style={{
                gridTemplateColumns: `repeat(${SHAPES[block].shape[0].length}, 1fr)`,
              }}
            >
              {SHAPES[block].shape.map((row, rowIndex) =>
                row.map((isSet, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded ${
                      isSet ? getBlockColor(block) : "bg-gray-600/40"
                    }`}
                  >
                    {isSet && (
                      <div className="relative w-full h-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded" />
                        <div className="absolute inset-0 bg-gradient-to-tl from-black/20 to-transparent rounded" />
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
