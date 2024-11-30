"use server";

import { RegisterController } from "@/app/controllers/registerController";

export async function register(formData: FormData) {
  try {
    console.log("Starting registration process...");

    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!email || !username || !password) {
      return {
        success: false,
        error: "All fields are required",
      };
    }

    const result = await RegisterController.register({
      email,
      username,
      password,
    });

    console.log("Registration result:", result);

    return {
      success: result.success,
      error: result.message,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
