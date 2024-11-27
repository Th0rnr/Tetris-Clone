"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { logout } from "@/app/login/actions";
import { useRouter } from "next/navigation";

interface NavigationProps {
  user?: {
    username: string;
    email: string;
    profilePicture?: string | null;
  } | null;
}

export default function Navigation({ user }: NavigationProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async (formData: FormData) => {
    const result = await logout();
    if (result.success) {
      router.push("/login");
    }
  };

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link href="/private/game" className="flex items-center space-x-1">
            <span className="text-2xl font-bold">
              <span className="text-blue-500">T</span>
              <span className="text-yellow-400">E</span>
              <span className="text-green-500">T</span>
              <span className="text-red-500">R</span>
              <span className="text-purple-500">I</span>
              <span className="text-orange-500">S</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center">
            {!user ? (
              <div className="flex space-x-4">
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  {user.profilePicture ? (
                    <Image
                      src={user.profilePicture}
                      alt={user.username}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-white">
                        {user.username[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span>{user.username}</span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-xl z-50">
                    <Link
                      href="/private/game"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Play Game
                    </Link>
                    <Link
                      href="/private/leaderboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Leaderboard
                    </Link>
                    <Link
                      href="/private/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <div className="border-t border-gray-100"></div>
                    <form action={handleLogout}>
                      <button
                        type="submit"
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Logout
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
