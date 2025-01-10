import { prisma } from "@/utils/PrismaClient";
import { supabase } from "@/utils/Client";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NODE_ENV === "production"
    ? "https://tetris-clone.netlify.app/"
    : "http://localhost:3000");

interface RegistrationData {
  email: string;
  username: string;
  password: string;
  profilePicture?: string | null;
}

interface PasswordValidation {
  isValid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidation {
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

export async function register({
  email,
  username,
  password,
  profilePicture = null,
}: RegistrationData) {
  try {
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(
        `Invalid password: ${passwordValidation.errors.join(", ")}`
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new Error("Email already registered");
      }
      if (existingUser.username === username) {
        throw new Error("Username already taken");
      }
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        profilePicture,
        emailVerified: false,
      },
      select: {
        id: true,
        email: true,
        username: true,
        profilePicture: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const { error: emailError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${SITE_URL}/api/verify?userId=${user.id}`,
      },
    });

    if (emailError) {
      await prisma.user.delete({
        where: { id: user.id },
      });
      throw new Error("Failed to send verification email");
    }

    return {
      success: true,
      user,
      message:
        "Registration successful. Please check your email to verify your account.",
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Registration failed");
  }
}

export async function isEmailAvailable(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user === null;
}

export async function isUsernameAvailable(username: string): Promise<boolean> {
  const user = await prisma.user.findFirst({
    where: { username },
  });
  return user === null;
}
