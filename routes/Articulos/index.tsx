import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";

import { db } from "../../database_conection/SQLConnection.ts";
import { Filtro_Articulos } from "../../islands/Filtros/Filto_Articulos.tsx";
import {
  BBDD_Aceite,
  BBDD_Articulo,
  BBDD_Envase,
  BBDD_IVA,
  BBDD_Tamano,
  MyState,
} from "../../types.ts";

export const handler: Handlers<
  {
    iva: BBDD_IVA[];
    envase: BBDD_Envase[];
    tamano: BBDD_Tamano[];
    aceite: BBDD_Aceite[];
    a: BBDD_Articulo[];
    pag_activa: number;
  },
  MyState
> = {
  async GET(
    _req: Request,
    ctx: FreshContext<
      MyState,
      {
        iva: BBDD_IVA[];
        envase: BBDD_Envase[];
        tamano: BBDD_Tamano[];
        aceite: BBDD_Aceite[];
        a: BBDD_Articulo[];
        pag_activa: number;
      }
    >
  ) {
    const url = new URL(_req.url);
    const pag_activa: string = url.searchParams.get("pagina") || "0";
    const [art] = await (
      await db()!
    ).query(
      `SELECT
      a.id_articulo,
      a.nombre AS articulo_nombre,
      a.precio,
      a.cantidad,

      -- Aceite
      da.id AS aceite_id,
      da.tipo AS aceite_tipo,
      da.OBSERVACIONES AS aceite_observaciones,

      -- Tamaño
      dt.id AS tamano_id,
      dt.tipo AS tamano_tipo,
      dt.OBSERVACIONES AS tamano_observaciones,

      -- Envase
      de.id AS envase_id,
      de.tipo AS envase_tipo,
      de.OBSERVACIONES AS envase_observaciones,

      -- IVA
      i.id AS iva_id,
      i.tipo AS iva_tipo,
      i.actualizado AS iva_actualizado,
      i.usuario_actualizador AS iva_usuario

      FROM articulos a
      JOIN dic_aceite da ON da.id = a.tipo_aceite
      JOIN dic_tamano dt ON dt.id = a.tamano
      JOIN dic_envase de ON de.id = a.envase
      JOIN iva i ON i.id = a.Tipo_IVA
      LIMIT 20 OFFSET ${parseInt(pag_activa!) * 20}
      `
    );
    const [env] = await (
      await db()!
    ).query(`SELECT * FROM fabrica.dic_envase `);
    const [tam] = await (
      await db()!
    ).query(`SELECT * FROM fabrica.dic_tamano `);
    const [ace] = await (
      await db()!
    ).query(`SELECT * FROM fabrica.dic_aceite `);
    const [iv] = await (await db()!).query(`SELECT * FROM fabrica.iva`);
    //@ts-expect-error check always exists
    const iva: BBDD_IVA[] = iv;

    iva.forEach((e) => {
      e.iloc = "IVA";
    });
    console.log(iva);
    //@ts-expect-error check always exists
    const envase: BBDD_Envase[] = env;
    envase.forEach((e) => {
      e.iloc = "Envase";
    });
    envase.forEach((e) => {
      e.iloc = "Envase";
    });
    //@ts-expect-error check always exists
    const tamano: BBDD_Tamano[] = tam;
    tamano.forEach((e) => {
      e.iloc = "Tamano";
    });
    //@ts-expect-error check always exists
    const aceite: BBDD_Aceite[] = ace;
    aceite.forEach((e) => {
      e.iloc = "Aceite";
    });

    // @ts-expect-error rows type comes as any[]
    const articulos: BBDD_Articulo[] = art.map((row) => ({
      iloc: "Articulo",
      id_articulo: row.id_articulo,
      nombre: row.articulo_nombre,
      precio: row.precio,
      cantidad: row.cantidad,
      OBSERVACIONES: row.articulo_observaciones,

      tipo_aceite: {
        iloc: "Aceite",
        id: row.aceite_id,
        tipo: row.aceite_tipo,
        OBSERVACIONES: row.aceite_observaciones,
      },

      tamano: {
        iloc: "Tamano",
        id: row.tamano_id,
        tipo: row.tamano_tipo,
        OBSERVACIONES: row.tamano_observaciones,
      },

      envase: {
        iloc: "Envase",
        id: row.envase_id,
        tipo: row.envase_tipo,
        OBSERVACIONES: row.envase_observaciones,
      },

      Tipo_IVA: {
        iloc: "IVA",
        id: row.iva_id,
        tipo: row.iva_tipo,
        actualizado: row.iva_actualizado,
        usuario_actualizador: row.iva_usuario,
      },
    }));

    if (articulos.length > 0) {
      const articulo: BBDD_Articulo[] = articulos;
      return ctx.render({
        iva,
        envase,
        tamano,
        aceite,
        a: articulo,
        pag_activa: parseInt(pag_activa!),
      });
    }

    return ctx.render({
      iva,
      envase,
      tamano,
      aceite,
      a: [],
      pag_activa: parseInt(pag_activa!),
    });
  },
};

export default function Home(
  props: PageProps<
    {
      iva: BBDD_IVA[];
      envase: BBDD_Envase[];
      tamano: BBDD_Tamano[];
      aceite: BBDD_Aceite[];
      a: BBDD_Articulo[];
      pag_activa: number;
    },
    MyState
  >
) {
  return (
    <div class="flex flex-row justify-start min-h-[calc(100dvh-5rem)] min-w-[calc(100dvw-6rem)]">
      <div class="flex flex-col w-full h-full p-2">
        <label class="font-bold">Articulos</label>
        <div class="flex flex-col w-full h-full items-start p-2  text-black border-gray-800 border-solid rounded-md border-2">
          <Filtro_Articulos arts={props.data.a}></Filtro_Articulos>
        </div>
      </div>
    </div>
  );
}
