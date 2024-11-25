"use client";

import { login, signup } from "./actions";

export default function LoginPage() {
  return (
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

        <form className="space-y-6">
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

          <div className="flex gap-4">
            <button
              formAction={login}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Log in
            </button>
            <button
              formAction={signup}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
