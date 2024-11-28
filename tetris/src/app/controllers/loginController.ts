import { prisma } from "@/utils/PrismaClient";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET ?? "your_secret_key";
const ACCESS_TOKEN_LIFETIME = process.env.ACCESS_TOKEN_LIFETIME ?? "1h";

interface TokenPayload {
  userId: string;
}

export class LoginController {
  static async login(email: string, password: string) {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      // If no user found, throw error
      if (!user) {
        throw new Error("Login failed");
      }

      // Compare password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new Error("Login failed");
      }

      // Create JWT token
      const token = jwt.sign(
        { userId: user.id } satisfies TokenPayload,
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

      // Return user data without password
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }

  static async validateToken(token: string): Promise<TokenPayload | null> {
    try {
      const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
      return decoded as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  static async getUserFromToken(token: string) {
    try {
      const decoded = await LoginController.validateToken(token);

      if (!decoded) {
        return null;
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          username: true,
          profilePicture: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error) {
      return null;
    }
  }

  static async logout(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
  }
}