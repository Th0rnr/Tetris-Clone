"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

const errorMessages = {
  invalid_input: "Please check your email and password",
  signup_failed: "Unable to create your account. Please try again.",
  no_user_data: "Account creation failed. Please try again.",
  invalid_credentials: "Invalid email or password",
  unexpected_error: "An unexpected error occurred. Please try again.",
};

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const errorType = searchParams.get("message") || "unexpected_error";
  const errorMessage = errorMessages[errorType as keyof typeof errorMessages];

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
        <p className="text-white mb-6">{errorMessage}</p>
        <Link
          href="/login"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Return to Login
        </Link>
      </div>
    </div>
  );
}
