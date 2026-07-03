import { Handlers } from "$fresh/server.ts";
import { buildExpiredAuthCookie } from "../utils/security.ts";

export const handler: Handlers = {
  GET() {
    return new Response(null, {
      status: 302,
      headers: {
        "Set-Cookie": buildExpiredAuthCookie(),
        location: "/login",
      },
    });
  },
};
