import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";

import { db } from "../../database_conection/SQLConnection.ts";

import { Filtro_Clientes } from "../../islands/Filtros/Filtro_Clientes.tsx";
import { BBDD_Cliente, MyState } from "../../types.ts";
import { Clientes } from "../../islands/Clientes/Clientes.tsx";

export const handler: Handlers<
  { c: BBDD_Cliente[]; pag_activa: number },
  MyState
> = {
  async GET(
    _req: Request,
    ctx: FreshContext<
      MyState,
      { c: BBDD_Cliente[]; pag_activa: number }
    >,
  ) {
    const url = new URL(_req.url);
    const pag_activa: string = url.searchParams.get("pagina") || "0";
    const [cli] = await (await db()!).query(
      `SELECT * FROM fabrica.clientes WHERE Activo=1 LIMIT 50 OFFSET ${
        parseInt(pag_activa!) * 50
      }`,
    );

    //@ts-expect-error check always exists
    if (cli.length > 0) {
      //@ts-expect-error check always exists
      const cliente: BBDD_Cliente[] = cli;
      return ctx.render({ c: cliente, pag_activa: parseInt(pag_activa!) });
    }
    return new Response("Not Found", { status: 404 });
  },
};

export default function Home(
  props: PageProps<{ c: BBDD_Cliente[]; pag_activa: number }, MyState>,
) {
  return (
    <div class="flex flex-row justify-start min-h-[calc(100dvh-5rem)] min-w-[calc(100dvw-6rem)]">
      <div class="flex flex-col w-full h-full p-2">
        <label class="font-bold">Clientes</label>
        <div class="flex flex-col w-full h-full items-start p-2  text-black border-gray-800 border-solid rounded-md border-2">
          <Filtro_Clientes
            clts={props.data.c}
            pag_activa={props.data.pag_activa}
          >
          </Filtro_Clientes>
        </div>
      </div>
    </div>
  );
}
