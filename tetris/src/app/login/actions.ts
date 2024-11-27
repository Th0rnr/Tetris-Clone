"use server";

import { RegisterController } from "@/app/controllers/registerController";
import { LoginController } from "@/app/controllers/loginController";

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

export async function login(formData: FormData) {
  try {
    console.log("Starting login process...");

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return {
        success: false,
        error: "Email and password are required",
      };
    }

    const result = await LoginController.login(email, password);
    console.log("Login result:", result);

    return {
      success: !!result, // Convert result to boolean
      error: result ? null : "Invalid credentials",
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function logout() {
  try {
    await LoginController.logout();
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      error: "Failed to logout",
    };
  }
}
