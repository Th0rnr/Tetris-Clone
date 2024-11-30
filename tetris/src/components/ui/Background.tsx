"use client";

import React, { useEffect, useState } from "react";

type TetrominoType = "I" | "J" | "L" | "O" | "S" | "T" | "Z";

interface TetrisPiece {
  blocks: [number, number][];
  color: string;
}

interface Piece {
  id: number;
  type: TetrominoType;
  x: number;
  y: number;
  color: string;
  blocks: [number, number][];
}

const TetrisBackground: React.FC = () => {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const FALL_SPEED = 2;

  const tetrisPieces: Record<TetrominoType, TetrisPiece> = {
    I: {
      blocks: [
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
      ],
      color: "bg-cyan-500",
    },
    J: {
      blocks: [
        [0, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      color: "bg-blue-500",
    },
    L: {
      blocks: [
        [2, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      color: "bg-orange-500",
    },
    O: {
      blocks: [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ],
      color: "bg-yellow-500",
    },
    S: {
      blocks: [
        [1, 0],
        [2, 0],
        [0, 1],
        [1, 1],
      ],
      color: "bg-green-500",
    },
    T: {
      blocks: [
        [1, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      color: "bg-purple-500",
    },
    Z: {
      blocks: [
        [0, 0],
        [1, 0],
        [1, 1],
        [2, 1],
      ],
      color: "bg-red-500",
    },
  };

  useEffect(() => {
    const BLOCK_SIZE = 30;
    const SPAWN_INTERVAL = 3000;

    const generatePiece = (): Piece => {
      const types = Object.keys(tetrisPieces) as TetrominoType[];
      const type = types[Math.floor(Math.random() * types.length)];
      const piece = tetrisPieces[type];

      const columns = Math.floor(window.innerWidth / BLOCK_SIZE);
      const spawnColumn = Math.floor((columns - 4) * Math.random());

      return {
        id: Math.random(),
        type,
        x: spawnColumn * BLOCK_SIZE,
        y: -2 * BLOCK_SIZE,
        color: piece.color,
        blocks: piece.blocks,
      };
    };

    setPieces([generatePiece()]);

    const spawnInterval = setInterval(() => {
      setPieces((prev) => {
        if (prev.length < 15) {
          return [...prev, generatePiece()];
        }
        return prev;
      });
    }, SPAWN_INTERVAL);

    let lastTime = 0;
    const animate = (currentTime: number) => {
      if (!lastTime) lastTime = currentTime;
      const delta = (currentTime - lastTime) / 16;
      lastTime = currentTime;

      setPieces((prevPieces) => {
        return prevPieces
          .map((piece) => ({
            ...piece,
            y: piece.y + FALL_SPEED * delta,
          }))
          .filter((piece) => piece.y < window.innerHeight);
      });

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(spawnInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-900 -z-10 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute transform-gpu"
          style={{ transform: `translate(${piece.x}px, ${piece.y}px)` }}
        >
          {piece.blocks.map((block, idx) => (
            <div
              key={idx}
              className={`absolute ${piece.color} rounded-sm`}
              style={{
                left: block[0] * 30,
                top: block[1] * 30,
                width: "30px",
                height: "30px",
                opacity: 0.4,
                boxShadow: "inset 0 0 8px rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
    </div>
  );
};

export default TetrisBackground;
