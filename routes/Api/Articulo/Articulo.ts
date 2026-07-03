import { FreshContext, Handlers } from "$fresh/server.ts";
import { BBDD_Articulo, MyState } from "../../../types.ts";
import { db } from "../../../database_conection/SQLConnection.ts";

export const handler: Handlers<unknown, MyState> = {
  PUT: async (req: Request, _ctx: FreshContext<MyState, unknown>) => {
    const body: Partial<BBDD_Articulo> = await req.json();
    console.log("-art", body);

    const url = new URL(req.url);
    const pag_activa: string = url.searchParams.get("pagina") || "0";

    const [art] = await (await db()!).query(
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
      LIMIT 20 OFFSET ${parseInt(pag_activa!) * 20}`,
    );
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

    const arts: BBDD_Articulo[] = articulos;
    const res = new Response(JSON.stringify(arts));

    return res;
  },
  GET: async (req: Request, _ctx: FreshContext<MyState, unknown>) => {
    const [aceite] = await (await db()!).query(
      `SELECT
      -- Aceite
      da.id AS aceite_id,
      da.tipo AS aceite_tipo,
      da.OBSERVACIONES AS aceite_observaciones
      FROM dic_aceite da `,
    );
    const [tamano] = await (await db()!).query(
      `SELECT
      -- Tamaño
      dt.id AS tamano_id,
      dt.tipo AS tamano_tipo,
      dt.OBSERVACIONES AS tamano_observaciones
      FROM dic_tamano dt `,
    );
    const [envase] = await (await db()!).query(
      `SELECT
      -- Envase
      de.id AS envase_id,
      de.tipo AS envase_tipo,
      de.OBSERVACIONES AS envase_observaciones
      FROM dic_envase de`,
    );
    const [iva] = await (await db()!).query(
      `SELECT
      -- IVA
      i.id AS iva_id,
      i.tipo AS iva_tipo,
      i.actualizado AS iva_actualizado,
      i.usuario_actualizador AS iva_usuario
      FROM  iva i `,
    );
    const dics = {
      tipo_aceite: aceite,
      tamano: tamano,
      envase: envase,
      Tipo_IVA: iva,
    };
    const res = new Response(JSON.stringify(dics));

    return res;
  },
  //Añadir cliente, con dir, cont y emp opcional
  POST: async (req: Request, _ctx: FreshContext<MyState, unknown>) => {
    console.log("POST 1 lgo", _ctx.state.Nombre);
    try {
      const body: Partial<BBDD_Articulo> = await req.json();
      console.log("POST body: \n", body);

      //clinete----------------------------------------------------------------------------
      const test = await (await db()!).query(
        `INSERT INTO articulos (nombre, precio, cantidad,tipo_aceite,usuario_actualizador, envase,tamano,Tipo_IVA)
        vALUES (?, ?, ?, ?, ?, ?, ?,?)`,
        [
          body.nombre,
          body.precio,
          body.cantidad,
          body.tipo_aceite,
          _ctx.state.Nombre,
          body.envase,
          body.tamano,
          body.Tipo_IVA,
        ],
      );
      console.log(test);

      const headers = new Headers({
        "Content-Type": "application/json",
      });
      const res = new Response(JSON.stringify(body), {
        headers,
        status: 200,
      });
      return res;
    } catch (e) {
      console.log("Error: \n", e);
      return new Response("ERRRRRERERER", {
        status: 404,
      });
    }
  },
};
