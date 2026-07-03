import { FreshContext, Handlers } from "$fresh/server.ts";
import jwt from "jsonwebtoken";
import { createConnection, db } from "../database_conection/SQLConnection.ts";
import { Login } from "../components/login/Login.tsx";

export const handler: Handlers = {
  POST: async (req: Request, ctx: FreshContext) => {
    try {
      const form = await req.formData();
      const usuario = form.get("usuario");
      const contrasena = form.get("contrasena");
      const keygen = await Deno.env.get("KEYGEN");
      const dbUser = await createConnection(
        usuario as string,
        contrasena as string,
      );
      console.log("conectado");

      const [check] = await dbUser.query(
        `SELECT * FROM fabrica.usuarios WHERE Nombre='${usuario}' AND Password='${contrasena}'`,
      );
      console.log(check);

      //@ts-expect-error check always exists
      const user: User = check[0];
      if (user) {
        const token = jwt.sign(JSON.stringify(user), keygen);
        console.log("Token: ", token);
        const headers = new Headers({
          "Set-Cookie": `auth=${token}; Max-Age=3600;`,
          location: "/Portal",
        });

        console.log("LOGIN: ", usuario, contrasena);
        ctx.state = { user: user.Nombre, id_usuario: user.id_usuario };
        return new Response("", {
          headers,
          status: 302,
        });
      }
      return ctx.render();
    } catch (error) {
      console.log(error);

      return ctx.render();
    }
  },
};
export default function Home() {
  return <Login></Login>;
}
