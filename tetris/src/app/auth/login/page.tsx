"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "./actions";
import Link from "next/link";
import TetrisSpinner from "@/components/loader/TetrisSpinner";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      setError(null);
      setIsLoading(true);
      const result = await login(formData);

      if (result?.success) {
        router.push("/private/game");
        return;
      }

      if (result?.error) {
        setError(result.error);
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
        router.push("/game");
        return;
      }
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {isLoading && <TetrisSpinner />}
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            <span className="flex justify-center space-x-1">
              <span className="text-blue-500">T</span>
              <span className="text-yellow-400">E</span>
              <span className="text-green-500">T</span>
              <span className="text-red-500">R</span>
              <span className="text-purple-500">I</span>
              <span className="text-orange-500">S</span>
            </span>
          </h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              disabled={isLoading}
            >
              Log in
            </button>
          </form>

          <p className="mt-4 text-center text-gray-400">
            Don't have an account?{" "}
            <Link
              href="/auth/register"
              className="text-blue-400 hover:text-blue-300"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
