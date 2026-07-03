import { FreshContext } from "$fresh/server.ts";
import { getAuthToken, redirect, verifyAuthToken } from "../utils/security.ts";

const PUBLIC_ROUTES = new Set(["/login"]);
const PUBLIC_PREFIXES = ["/static/", "/favicon.ico"];

function isPublicRequest(ctx: FreshContext): boolean {
  if (ctx.destination !== "route") return true;
  if (PUBLIC_ROUTES.has(ctx.route)) return true;
  return PUBLIC_PREFIXES.some((prefix) => ctx.url.pathname.startsWith(prefix));
}

export const handler = async (req: Request, ctx: FreshContext) => {
  try {
    if (isPublicRequest(ctx)) {
      return await ctx.next();
    }

    const token = getAuthToken(req);
    if (!token) return redirect("/login");

    const payload = verifyAuthToken(token);
    ctx.state = {
      id_usuario: payload.id_usuario,
      Nombre: payload.Nombre,
      route: ctx.route,
    };

    return await ctx.next();
  } catch (error) {
    console.error("Token no válido o error de middleware:", error);
    return redirect("/login");
  }
};
