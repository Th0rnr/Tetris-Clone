import { prisma } from "@/utils/PrismaClient";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET ?? "your_secret_key";
const ACCESS_TOKEN_LIFETIME = process.env.ACCESS_TOKEN_LIFETIME ?? "1h";
const SALT_ROUNDS = 10;

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
    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(
        `Invalid password: ${passwordValidation.errors.join(", ")}`
      );
    }

    // Check if user already exists
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        profilePicture,
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

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id.toString() },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_LIFETIME }
    );

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600, // 1 hour in seconds
    });

    return {
      success: true,
      user,
      message: "Registration successful",
    };
  } catch (error) {
    // Handle known error types
    if (error instanceof Error) {
      throw error;
    }
    // Handle unknown errors
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
