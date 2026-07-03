import { FreshContext, Handlers } from "$fresh/server.ts";
import {
  BBDD_Cliente,
  BBDD_Contacto,
  BBDD_Direccion,
  BBDD_Empresa,
  MyState,
} from "../../../types.ts";
import { db } from "../../../database_conection/SQLConnection.ts";

export const handler: Handlers<unknown, MyState> = {
  PUT: async (req: Request, _ctx: FreshContext<MyState, unknown>) => {
    const body: Partial<BBDD_Cliente> = await req.json();
    console.log(body);

    const url = new URL(req.url);
    const pag_activa: string = url.searchParams.get("pagina") || "0";

    const [exist] = await (await db()!).query(
      `SELECT * FROM clientes WHERE (Nombre like '%${body.Nombre || ""}%' 
            AND Apellidos like '%${body.Apellidos || ""}%'
            AND DNI like '%${body.DNI || ""}%' AND Fecha_mod like '%${
        body.Fecha_mod || ""
      }%' ) AND Activo=1 LIMIT 50 OFFSET ${parseInt(pag_activa!) * 50}`,
    );
    const res = new Response(JSON.stringify(exist));

    return res;
  },

  //Añadir cliente, con dir, cont y emp opcional
  async POST(req: Request, _ctx: FreshContext<MyState, unknown>) {
    console.log("POST 1 lgo", _ctx.state.Nombre);
    try {
      const body: [
        Partial<BBDD_Cliente>,
        Partial<BBDD_Direccion>,
        Partial<BBDD_Contacto>,
        Partial<BBDD_Empresa>,
        boolean,
        boolean,
      ] = await req.json();
      //clinete----------------------------------------------------------------------------
      await (await db()!).query(
        `INSERT INTO clientes (Nombre, Apellidos, DNI,OBSERVACIONES,usuario_actualizador, Activo)
        SELECT '${body[0].Nombre}', '${body[0].Apellidos}', '${body[0].DNI}','${
          body[0].OBSERVACIONES
        }','${_ctx.state.Nombre}', 1
        FROM DUAL
        WHERE NOT EXISTS (
          SELECT 1 FROM clientes WHERE Nombre = '${
          body[0].Nombre
        }' and Apellidos =  '${body[0].Apellidos}' and DNI = '${body[0].DNI}'
        );`,
      );
      const [cli] = await (await db()!)!.query(`
        SELECT * FROM clientes
        WHERE  Nombre = '${body[0].Nombre}' and Apellidos =  '${
        body[0].Apellidos
      }' and DNI = '${body[0].DNI}'`);

      //@ts-expect-error-es tipocoorecto
      const new_cliente: BBDD_Cliente = cli[0];
      console.log(new_cliente);
      //empresa----------------------------------------------------------------------------
      if (body[5]) {
        console.log("POST 2 lgo");
        if (body[4]) {
          // NUEVA EMPRESA
          await (await db()!)!.query(
            `INSERT INTO empresa (Razon_Social, CIF, OBSERVACIONES, id_cliente,usuario_actualizador, Activo)
            SELECT ?, ?, ?, ?,?, 1
            FROM DUAL
            WHERE NOT EXISTS (
              SELECT 1 FROM empresa WHERE Razon_Social = ? AND CIF = ? 
            )`,
            [
              body[3].Razon_Social,
              body[3].CIF,
              body[3].OBSERVACIONES || "-",
              new_cliente.id_cliente,
              _ctx.state.Nombre,
              1,
              body[3].Razon_Social,
              body[3].CIF,
            ],
          );

          const [emp] = await (await db()!).query(
            `SELECT * FROM empresa WHERE Razon_Social = ? AND CIF = ?`,
            [body[3].Razon_Social, body[3].CIF],
          );
          const new_empresa: BBDD_Empresa = (emp as any)[0];

          // DIRECCIÓN
          await (await db()!).query(
            `INSERT INTO direccion (id_empresa, direccion,codigo_postal, localidad, municipio, provincia, OBSERVACIONES, Activo)
            VALUES (?, ?, ?, ?, ?, ?,?,?, 1)`,
            [
              new_empresa.id_empresa,
              body[1].direccion,
              body[1].codigo_postal,
              body[1].localidad,
              body[1].municipio,
              body[1].provincia,
              body[1].OBSERVACIONES || "-",
              _ctx.state.Nombre,
              1,
            ],
          );

          // CONTACTO
          await (await db()!).query(
            `INSERT INTO contacto (id_empresa, Telefono, Fijo, Email, OBSERVACIONES,usuario_actualizador, Activo)
            VALUES (?, ?, ?, ?, ?,? 1)`,
            [
              new_empresa.id_empresa,
              body[2].Telefono,
              body[2].Fijo,
              body[2].Email,
              body[2].OBSERVACIONES || "-",
              _ctx.state.Nombre,
              1,
            ],
          );
        } else {
          // EMPRESA EXISTENTE → actualizar `id_cliente`
          await (await db()!).query(
            `UPDATE empresa SET id_cliente = ?, usuario_actualizador=? WHERE Razon_Social = ? AND CIF = ?`,
            [
              new_cliente.id_cliente,
              _ctx.state.Nombre,
              body[3].Razon_Social,
              body[3].CIF,
            ],
          );
        }
      }

      //direccion----------------------------------------------------------------------------
      const [dir] = await (await db()!).query(
        `INSERT INTO direccion 
        (id_cliente, direccion, localidad,codigo_postal, municipio, provincia, OBSERVACIONES,usuario_actualizador, Activo)
        VALUES (? ,   ?,          ?,          ?,        ?,        ?,              ?,?,1)`,
        [
          new_cliente.id_cliente,
          body[1].direccion,
          body[1].localidad,
          body[1].codigo_postal,
          body[1].municipio,
          body[1].provincia,
          body[1].OBSERVACIONES == undefined ? "-" : body[1].OBSERVACIONES,
          _ctx.state.Nombre,
          1,
        ],
      );
      console.log(dir);

      //contacto----------------------------------------------------------------------------
      const [cont] = await (await db()!).query(
        `INSERT INTO contacto 
        (id_cliente, Telefono, Fijo, Email, OBSERVACIONES,usuario_actualizador, Activo)
         VALUES (?, ?, ?, ?, ?, ?,?,1)`,
        [
          new_cliente.id_cliente,
          body[2].Telefono,
          body[2].Fijo,
          body[2].Email,
          body[2].OBSERVACIONES || "-",
          _ctx.state.Nombre,
          1,
        ],
      );
      const headers = new Headers({
        Location: `/Clientes/${new_cliente.id_cliente}`,
      });
      return Response.redirect(
        `http://localhost:8000/Clientes/${new_cliente.id_cliente}`,
        303,
      );
    } catch (e) {
      console.log("Error: ", e);
      return new Response("ERRRRRERERER", {
        status: 404,
      });
    }
  },
};
