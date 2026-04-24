import { NextResponse } from "next/server";
import { createSession, SESSION_COOKIE_NAME, validateCredentials } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = body?.email;
  const password = body?.password;

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  const user = validateCredentials(email, password);
  if (!user) {
    return NextResponse.json(
      { error: "Invalid credentials. Try demo@shopai.com / demo1234." },
      { status: 401 }
    );
  }

  const sessionToken = createSession(user);
  const res = NextResponse.json({ user });

  res.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return res;
}
