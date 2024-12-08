import { prisma } from "@/utils/PrismaClient";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET ?? "your_secret_key";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET ?? "refresh_secret_key";
const ACCESS_TOKEN_LIFETIME = "1h";
const REFRESH_TOKEN_LIFETIME = "30d";

interface TokenPayload {
  userId: string;
}

export async function login(
  email: string,
  password: string,
  rememberMe: boolean = false
) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Login failed");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Login failed");
    }

    const token = jwt.sign(
      { userId: user.id } satisfies TokenPayload,
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_LIFETIME }
    );

    const cookieStore = await cookies();
    cookieStore.set("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600, // 1 hour
    });

    if (rememberMe) {
      const refreshToken = jwt.sign(
        { userId: user.id } satisfies TokenPayload,
        REFRESH_TOKEN_SECRET,
        { expiresIn: REFRESH_TOKEN_LIFETIME }
      );

      cookieStore.set("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
}

export async function validateToken(
  token: string
): Promise<TokenPayload | null> {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    return decoded as TokenPayload;
  } catch (error) {
    return null;
  }
}

export async function validateRefreshToken(
  token: string
): Promise<TokenPayload | null> {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    return decoded as TokenPayload;
  } catch (error) {
    return null;
  }
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<boolean> {
  try {
    const decoded = await validateRefreshToken(refreshToken);
    if (!decoded) return false;

    const token = jwt.sign({ userId: decoded.userId }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_LIFETIME,
    });

    const cookieStore = await cookies();
    cookieStore.set("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600, // 1 hour
    });

    return true;
  } catch (error) {
    return false;
  }
}

export async function getUserFromToken(token: string) {
  try {
    const decoded = await validateToken(token);

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

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
}
