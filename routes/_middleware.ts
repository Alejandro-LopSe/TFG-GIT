import { FreshContext } from "$fresh/server.ts";
import jwt from "jsonwebtoken";
import { MyState } from ".././types.ts";

/*export const handler = async (
  req: Request,
  ctx: FreshContext<MyState>,
) => {
  if (!ctx.route) {
    const headers = new Headers({ location: "/Portal" });
    return new Response("", {
      headers,
      status: 302,
    });
  }
  if (ctx.destination !== "route") {
    const res = await ctx.next();
    return res;
  }
  if (ctx.route === "/login") {
    const res = await ctx.next();
    return res;
  }
  const headers = req.headers;
  const cookie_raw = headers.get("cookie");
  if (!cookie_raw) {
    const headers = new Headers({ location: "/login" });
    return new Response("", {
      headers,
      status: 302,
    });
  }

  const cookie = cookie_raw.substring(5);
  if (!cookie) {
    const headers = new Headers({ location: "/login" });
    return new Response("", {
      headers,
      status: 302,
    });
  }
  const keygen = Deno.env.get("KEYGEN");
  const payload = jwt.verify(cookie, keygen);
  console.log(payload);

  if (!payload) {
    const headers = new Headers({ location: "/login" });
    return new Response("", {
      headers,
      status: 302,
    });
  }
  ctx.state = {
    id_usuario: payload.id_usuario,
    Nombre: payload.Nombre,
    route: ctx.route,
  };

  const res = await ctx.next();
  return res;
};
import { FreshContext } from "$fresh/server.ts";
import jwt from "jsonwebtoken";
import { MyState } from ".././types.ts";
*/

export const handler = async (req: Request, ctx: FreshContext<MyState>) => {
  try {
    if (!ctx.route && !ctx.url.pathname.includes("/Api/")) {
      //console.log("Middleware-1", ctx.url.pathname);

      const headers = new Headers({ location: "/Portal" });
      return new Response("", {
        headers,
        status: 302,
      });
    }
    if (ctx.destination !== "route") {
      //console.log("Middleware-2");
      const res = await ctx.next();
      return res;
    }
    if (ctx.route === "/login") {
      //console.log("Middleware-3");
      const res = await ctx.next();
      return res;
    }
    if (ctx.route === "/Api") {
      //console.log("Middleware-4");
      const res = await ctx.next();
      return res;
    }
    //console.log("Middleware-otros");
    const rawCookies = req.headers.get("cookie");
    if (!rawCookies) {
      const headers = new Headers({ location: "/login" });
      return new Response("", {
        headers,
        status: 302,
      });
    }

    const cookies = Object.fromEntries(
      rawCookies.split(";").map((c) => c.trim().split("=")),
    );

    const token = cookies["auth"];
    if (!token) {
      const headers = new Headers({ location: "/login" });
      return new Response("", {
        headers,
        status: 302,
      });
    }

    const keygen = await Deno.env.get("KEYGEN");
    let payload;
    try {
      payload = jwt.verify(token, keygen);
    } catch (err) {
      console.error("❌ Token inválido:", err);
      const headers = new Headers({ location: "/login" });
      return new Response("", {
        headers,
        status: 302,
      });
    }

    ctx.state = {
      id_usuario: payload.id_usuario,
      Nombre: payload.Nombre,
      route: ctx.route,
    };
    console.log("state _middleware", ctx.state, ctx.params);
    return await ctx.next();
  } catch (error) {
    console.log("MIDDLEWARE ERROR", error);
  }
};
