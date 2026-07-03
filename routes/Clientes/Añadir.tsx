import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { Base } from "../../components/Detalle/Base.tsx";
import { Contacto } from "../../components/Detalle/Contacto.tsx";
import { Direccion } from "../../components/Detalle/Direccion.tsx";
import { Empresa } from "../../components/Detalle/Empresa.tsx";
import { db } from "../../database_conection/SQLConnection.ts";
import { Anadir_Cliente } from "../../islands/Clientes/Anadir_Cliente.tsx";
import {
  BBDD_Cliente,
  BBDD_Contacto,
  BBDD_Direccion,
  BBDD_Empresa,
  MyState,
} from "../../types.ts";

export const handler: Handlers<unknown, MyState> = {
  //@ts-expect-error ctx.params is always defined
  async POST(
    req: Request,
    ctx: FreshContext<
      MyState
    >,
  ) {
    const id = ctx.params.id;
    if (id) {
      const [cli] = await (await db()!).query(
        `SELECT * FROM fabrica.clientes WHERE id_cliente=${id} AND Activo=1`,
      );
      const [cont] = await (await db()!).query(
        `SELECT * FROM fabrica.contacto WHERE id_cliente=${id} `,
      );
      const [dir] = await (await db()!).query(
        `SELECT * FROM fabrica.direccion WHERE id_cliente=${id} `,
      );
      const [em] = await (await db()!).query(
        `SELECT * FROM fabrica.empresa WHERE id_cliente=${id} `,
      );
      //@ts-expect-error check always exists
      if (cli.length > 0) {
        //@ts-expect-error check always exists
        const cliente: BBDD_Cliente = cli[0];

        const data = {
          cliente: cliente,
          //@ts-expect-error check always exists
          contacto: cont.length > 0 ? cont[0] : undefined,
          //@ts-expect-error check always exists
          direccion: dir.length > 0 ? dir[0] : undefined,
          //@ts-expect-error check always exists
          empresa: em.length > 0 ? em[0] : undefined,
        };
        return ctx.render(data);
      }
      return new Response("Not Found", { status: 404 });
    }
  },
};

export default function Home(
  props: PageProps<
    unknown,
    MyState
  >,
) {
  return (
    <div class="flex flex-row justify-center min-h-[calc(100dvh-5rem)] min-w-[calc(100dvw-6rem)]">
      <Anadir_Cliente />
    </div>
  );
}
