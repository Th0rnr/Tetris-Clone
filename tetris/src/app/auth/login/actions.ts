"use server";

import {
  login as loginFn,
  logout as logoutFn,
} from "@/app/controllers/loginController";

export async function login(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const rememberMe = formData.get("rememberMe") === "on";

    if (!email || !password) {
      return {
        success: false,
        error: "Email and password are required",
      };
    }

    const result = await loginFn(email, password, rememberMe);
    console.log("Login result:", result);

    return {
      success: !!result,
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
    await logoutFn();
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      error: "Failed to logout",
    };
  }
}
