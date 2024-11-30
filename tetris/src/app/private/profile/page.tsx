"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import TetrisSpinner from "@/components/loader/TetrisSpinner";
import {
  updateUsername,
  uploadProfilePicture,
  updatePassword,
} from "./actions";

interface User {
  id: string;
  username: string;
  email: string;
  profilePicture: string | null;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newUsername, setNewUsername] = useState<string>("");
  const [success, setSuccess] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user");
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
          setNewUsername(data.user.username || "");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/login");
      }
    };

    fetchUser();
  }, [router]);

  const handleUsernameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await updateUsername(user.id, newUsername);
      if (result.success) {
        setSuccess("Username updated successfully!");
        setUser((prev) => (prev ? { ...prev, username: newUsername } : null));
      } else {
        setError(result.error ?? "Failed to update username");
      }
    } catch (error) {
      setError("Failed to update username");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (file.size > maxSize) {
      setError("File size should be less than 5MB");
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a JPEG, PNG, or WebP image");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await uploadProfilePicture(user.id, file);

      if (result.success) {
        setSuccess("Profile picture updated successfully!");
        if (result.url) {
          setUser((prev) =>
            prev ? { ...prev, profilePicture: result.url } : null
          );
        }
      } else {
        setError(result.error ?? "Failed to update profile picture");
      }
    } catch (error) {
      setError("Failed to update profile picture");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const result = await updatePassword(
        user.id,
        currentPassword,
        newPassword
      );
      if (result.success) {
        setSuccess("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(result.error ?? "Failed to update password");
      }
    } catch (error) {
      setError("Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-900 py-8 px-4">
      {isLoading && <TetrisSpinner />}

      <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-white mb-8">
            Profile Settings
          </h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-2 rounded mb-6">
              {success}
            </div>
          )}

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">
                Profile Picture
              </h2>
              <div className="flex items-center space-x-6">
                <div className="relative w-24 h-24">
                  {user.profilePicture ? (
                    <Image
                      src={user.profilePicture}
                      alt={user.username}
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-3xl text-white">
                        {user.username[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <label className="block">
                  <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer">
                    Choose Image
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>

            <form onSubmit={handleUsernameUpdate} className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-200 mb-2"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                disabled={isLoading}
              >
                Update Username
              </button>
            </form>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Email</h2>
              <p className="text-gray-300">{user.email}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">
                Update Password
              </h2>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-gray-200 mb-2"
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-200 mb-2"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-200 mb-2"
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <p className="text-sm text-gray-400">
                  Password must contain at least 8 characters, one uppercase
                  letter, one lowercase letter, one number, and one special
                  character.
                </p>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  disabled={isLoading}
                >
                  Update Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
