"use client";

import { useRouter } from "next/navigation";
import TetrisGame from "@/components/game/TetrisGame";

export default function GamePage() {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <div>
      <div className="absolute top-4 right-4">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
      <TetrisGame />
    </div>
  );
}
