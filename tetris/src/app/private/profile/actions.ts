"use server";

import { prisma } from "@/utils/PrismaClient";
import { supabase } from "@/utils/Client";
import bcrypt from "bcrypt";

export async function updateUsername(userId: string, newUsername: string) {
  try {
    if (!userId || !newUsername.trim()) {
      return {
        success: false,
        error: "Username cannot be empty",
      };
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        username: newUsername,
        NOT: {
          id: userId,
        },
      },
    });

    if (existingUser) {
      return {
        success: false,
        error: "Username is already taken",
      };
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        username: newUsername,
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      message: "Username updated successfully",
    };
  } catch (error) {
    console.error("Error updating username:", error);
    return {
      success: false,
      error: "Failed to update username",
    };
  }
}

export async function uploadProfilePicture(userId: string, file: File) {
  try {
    const fileName = `avatar_${userId}.jpg`;
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);

    await supabase.storage
      .from("avatars")
      .remove([fileName])
      .catch(() => console.log("No existing file to delete"));

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, fileBuffer, {
        upsert: true,
        contentType: "image/jpeg",
      });

    if (uploadError) {
      throw uploadError;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(fileName);

    await prisma.user.update({
      where: { id: userId },
      data: {
        profilePicture: `${publicUrl}?v=${Date.now()}`,
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      message: "Profile picture updated successfully",
      url: publicUrl,
    };
  } catch (error) {
    console.error("Detailed error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update profile picture",
    };
  }
}

export async function updatePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
) {
  try {
    if (!userId || !currentPassword || !newPassword) {
      return {
        success: false,
        error: "All password fields are required",
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        password: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      return {
        success: false,
        error: "Current password is incorrect",
      };
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return {
        success: false,
        error: `Invalid new password: ${passwordValidation.errors.join(", ")}`,
      };
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedNewPassword,
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      message: "Password updated successfully",
    };
  } catch (error) {
    console.error("Error updating password:", error);
    return {
      success: false,
      error: "Failed to update password",
    };
  }
}

function validatePassword(password: string) {
  const errors: string[] = [];

  const validations: [RegExp | ((p: string) => boolean), string][] = [
    [(p) => p.length >= 8, "Password must be at least 8 characters long"],
    [/[A-Z]/, "Password must contain at least one uppercase letter"],
    [/[a-z]/, "Password must contain at least one lowercase letter"],
    [/\d/, "Password must contain at least one number"],
    [
      /[@$!%*?&]/,
      "Password must contain at least one special character (@$!%*?&)",
    ],
  ];

  for (const [validation, message] of validations) {
    if (validation instanceof RegExp) {
      if (!validation.test(password)) {
        errors.push(message);
      }
    } else if (!validation(password)) {
      errors.push(message);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
