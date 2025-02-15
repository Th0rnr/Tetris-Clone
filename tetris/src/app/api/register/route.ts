import { NextRequest, NextResponse } from "next/server";
import { register } from "@/app/controllers/registerController";

export async function POST(request: NextRequest) {
  try {
    const { email, username, password } = await request.json();

    if (!email || !username || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await register({
      email,
      username,
      password,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Registration error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
