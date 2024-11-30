// app/api/highscores/route.ts
import { NextResponse } from "next/server";
import { highScoreController } from "@/app/controllers/highScoreController";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const scores = await highScoreController.getTopScores(limit);
    return NextResponse.json(scores);
  } catch (error) {
    console.error("Error fetching high scores:", error);
    return NextResponse.json(
      { error: "Failed to fetch high scores" },
      { status: 500 }
    );
  }
}