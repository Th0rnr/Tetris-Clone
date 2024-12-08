import { NextRequest, NextResponse } from "next/server";
import {
  getUserAchievements,
  getUserStats,
} from "@/app/controllers/AchievementController";
import { validateToken } from "@/app/controllers/loginController";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("access_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await validateToken(token);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    try {
      const [achievements, stats] = await Promise.all([
        getUserAchievements(user.userId),
        getUserStats(user.userId),
      ]);

      return NextResponse.json({
        success: true,
        achievements,
        stats,
      });
    } catch (error) {
      console.error("Error fetching achievements or stats:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch achievements data",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in achievements API:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch achievements",
      },
      { status: 500 }
    );
  }
}
