import { FreshContext, Handlers } from "$fresh/server.ts";
import { Login } from "../components/login/Login.tsx";
import { auditLog, db } from "../database_conection/SQLConnection.ts";
import type { User } from "../types.ts";
import { asString } from "../utils/validation.ts";
import {
  buildAuthCookie,
  signAuthToken,
  verifyPassword,
} from "../utils/security.ts";

export const handler: Handlers = {
  POST: async (req: Request, ctx: FreshContext) => {
    try {
      const form = await req.formData();
      const usuario = asString(form.get("usuario"));
      const contrasena = asString(form.get("contrasena"));

      if (!usuario || !contrasena) {
        return ctx.render({ error: "Usuario y contraseña son obligatorios" });
      }

      const [rows] = await db().execute(
        `SELECT id_usuario, Nombre, PasswordHash
         FROM usuarios
         WHERE Nombre = ?
         LIMIT 1`,
        [usuario],
      );

      const user = (rows as User[])[0];
      if (!user || !user.PasswordHash) {
        await auditLog(
          usuario,
          "Intento de login con usuario inexistente o sin hash configurado",
        );
        return ctx.render({ error: "Credenciales no válidas" });
      }

      const passwordIsValid = await verifyPassword(
        contrasena,
        user.PasswordHash,
      );
      if (!passwordIsValid) {
        await auditLog(usuario, "Intento de login fallido");
        return ctx.render({ error: "Credenciales no válidas" });
      }

      const token = signAuthToken(user);
      await auditLog(usuario, "Inicio de sesión correcto");

      return new Response(null, {
        status: 302,
        headers: {
          "Set-Cookie": buildAuthCookie(token),
          location: "/Portal",
        },
      });
    } catch (error) {
      console.error("Error en login:", error);
      return ctx.render({ error: "No se pudo iniciar sesión" });
    }
  },
};

export default function Home() {
  return <Login />;
}
