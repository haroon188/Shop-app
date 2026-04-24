import { randomUUID } from "crypto";
import { NextRequest } from "next/server";

export const SESSION_COOKIE_NAME = "shopai_session";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface SessionRecord {
  user: AuthUser;
  createdAt: number;
}

const DEMO_USERS = [
  {
    id: "u_demo",
    email: "demo@shopai.com",
    password: "demo1234",
    name: "Demo User",
  },
];

const sessions = new Map<string, SessionRecord>();

export function validateCredentials(email: string, password: string): AuthUser | null {
  const normalizedEmail = email.trim().toLowerCase();
  const account = DEMO_USERS.find(
    (user) => user.email === normalizedEmail && user.password === password
  );

  if (!account) return null;

  return {
    id: account.id,
    email: account.email,
    name: account.name,
  };
}

export function createSession(user: AuthUser): string {
  const token = `sess_${randomUUID()}`;
  sessions.set(token, { user, createdAt: Date.now() });
  return token;
}

export function clearSession(token: string): void {
  sessions.delete(token);
}

export function getUserBySessionToken(token: string | undefined): AuthUser | null {
  if (!token) return null;
  const session = sessions.get(token);
  return session?.user ?? null;
}

export function getUserFromRequest(req: NextRequest): AuthUser | null {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  return getUserBySessionToken(token);
}
