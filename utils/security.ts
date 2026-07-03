import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { User } from "../types.ts";

export type AuthPayload = {
  id_usuario: number;
  Nombre: string;
};

const COOKIE_NAME = "auth";
const SESSION_SECONDS = Number(Deno.env.get("SESSION_SECONDS") ?? "3600");

function jwtSecret(): string {
  const secret = Deno.env.get("KEYGEN");
  if (!secret || secret.length < 32) {
    throw new Error("KEYGEN debe existir y tener al menos 32 caracteres");
  }
  return secret;
}

export async function verifyPassword(
  plainPassword: string,
  passwordHash: string,
): Promise<boolean> {
  if (!plainPassword || !passwordHash) return false;
  return await bcrypt.compare(plainPassword, passwordHash);
}

export function signAuthToken(
  user: Pick<User, "id_usuario" | "Nombre">,
): string {
  return jwt.sign(
    { id_usuario: user.id_usuario, Nombre: user.Nombre },
    jwtSecret(),
    { expiresIn: SESSION_SECONDS },
  );
}

export function verifyAuthToken(token: string): AuthPayload {
  return jwt.verify(token, jwtSecret()) as AuthPayload;
}

export function buildAuthCookie(token: string): string {
  const isProduction = Deno.env.get("APP_ENV") === "production";
  const secure = isProduction ? "; Secure" : "";
  return `${COOKIE_NAME}=${token}; Max-Age=${SESSION_SECONDS}; Path=/; HttpOnly; SameSite=Lax${secure}`;
}

export function buildExpiredAuthCookie(): string {
  return `${COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax`;
}

export function getCookieValue(req: Request, name: string): string | undefined {
  const rawCookie = req.headers.get("cookie");
  if (!rawCookie) return undefined;

  return rawCookie
    .split(";")
    .map((cookie) => cookie.trim())
    .map((cookie) => cookie.split("="))
    .find(([cookieName]) => cookieName === name)?.[1];
}

export function getAuthToken(req: Request): string | undefined {
  return getCookieValue(req, COOKIE_NAME);
}

export function redirect(location: string): Response {
  return new Response(null, {
    status: 302,
    headers: { location },
  });
}

export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
