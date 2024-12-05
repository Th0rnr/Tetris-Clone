"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Trophy } from "lucide-react";
import { logout } from "@/app/auth/login/actions";
import { useRouter, usePathname } from "next/navigation";
import TetrisSpinner from "@/components/loader/TetrisSpinner";

interface NavigationProps {
  user?: {
    username: string;
    email: string;
    profilePicture?: string | null;
  } | null;
}

export default function Navigation({ user }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const MIN_LOADING_TIME = 500;

  useEffect(() => {
    if (loadingStartTime !== null) {
      const timeElapsed = Date.now() - loadingStartTime;
      const remainingTime = Math.max(0, MIN_LOADING_TIME - timeElapsed);

      const timer = setTimeout(() => {
        setIsLoading(false);
        setLoadingStartTime(null);
      }, remainingTime);

      return () => clearTimeout(timer);
    }
  }, [pathname, loadingStartTime]);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      setLoadingStartTime(Date.now());
      const result = await logout();
      if (result.success) {
        setIsMobileMenuOpen(false);
        setIsProfileDropdownOpen(false);
        router.push("/");
      } else {
        console.error("Logout failed:", result.error);
      }
    } catch (error) {
      console.error("Error during logout:", error);
      setIsLoading(false);
      setLoadingStartTime(null);
    }
  };

  const handleMenuItemClick = () => {
    setIsLoading(true);
    setLoadingStartTime(Date.now());
  };

  return (
    <>
      {isLoading && <TetrisSpinner />}
      <nav className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link
              href={user ? "/private/game" : "/"}
              className="flex items-center"
              onClick={handleMenuItemClick}
            >
              <span className="text-2xl font-bold">
                <span className="text-blue-500">T</span>
                <span className="text-yellow-400">E</span>
                <span className="text-green-500">T</span>
                <span className="text-red-500">R</span>
                <span className="text-purple-500">I</span>
                <span className="text-orange-500">S</span>
              </span>
            </Link>
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
            <div className="hidden md:flex items-center">
              {!user ? (
                <div className="flex space-x-4">
                  <Link
                    href="/auth/login"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-bold"
                    onClick={handleMenuItemClick}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-bold"
                    onClick={handleMenuItemClick}
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
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
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-xl z-50">
                      <Link
                        href="/private/game"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={handleMenuItemClick}
                      >
                        Play Game
                      </Link>
                      <Link
                        href="/private/leaderboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={handleMenuItemClick}
                      >
                        Leaderboard
                      </Link>
                      <Link
                        href="/private/achievements"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={handleMenuItemClick}
                      >
                        <div className="flex items-center gap-2">
                          <Trophy size={16} />
                          <span>Achievements</span>
                        </div>
                      </Link>
                      <Link
                        href="/private/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={handleMenuItemClick}
                      >
                        Profile
                      </Link>
                      <div className="border-t border-gray-100"></div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {isMobileMenuOpen && (
            <div className="md:hidden py-2">
              {!user ? (
                <div className="flex flex-col space-y-2 px-2 pb-3">
                  <Link
                    href="/auth/login"
                    className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    onClick={handleMenuItemClick}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    onClick={handleMenuItemClick}
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 px-2 pb-3">
                  <div className="flex items-center space-x-2 px-3 py-2">
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
                    <span className="text-gray-300">{user.username}</span>
                  </div>
                  <Link
                    href="/private/game"
                    className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    onClick={handleMenuItemClick}
                  >
                    Play Game
                  </Link>
                  <Link
                    href="/private/leaderboard"
                    className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    onClick={handleMenuItemClick}
                  >
                    Leaderboard
                  </Link>
                  <Link
                    href="/private/achievements"
                    className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    onClick={handleMenuItemClick}
                  >
                    <div className="flex items-center gap-2">
                      <Trophy size={16} />
                      <span>Achievements</span>
                    </div>
                  </Link>
                  <Link
                    href="/private/profile"
                    className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    onClick={handleMenuItemClick}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-400 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
