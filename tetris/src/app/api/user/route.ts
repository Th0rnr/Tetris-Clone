import { NextRequest, NextResponse } from "next/server";
import { LoginController } from "@/app/controllers/loginController";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await LoginController.getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error getting user:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
