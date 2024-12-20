import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/PrismaClient";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    });

    return NextResponse.redirect(
      new URL("/auth/login?verified=true", request.url)
    );
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.redirect(
      new URL("/auth/login?error=verification_failed", request.url)
    );
  }
}
