import { FreshContext, Handlers } from "$fresh/server.ts";
import {
  BBDD_Cliente,
  BBDD_Contacto,
  BBDD_Direccion,
  BBDD_Empresa,
  MyState,
} from "../../types.ts";
import { db } from "../../database_conection/SQLConnection.ts";

export const handler: Handlers<unknown, MyState> = {
  PUT: async (req: Request, _ctx: FreshContext<MyState, unknown>) => {
    const body: {
      cl?: Partial<BBDD_Cliente>;
      dr?: Partial<BBDD_Direccion>;
      ct?: Partial<BBDD_Contacto>;
      em?: Partial<BBDD_Empresa>;
    } = await req.json();
    console.log(_ctx.state.Nombre, body);

    if (body.cl) {
      console.log(1);

      const [cl] = await (await db()!).query(
        `UPDATE clientes set
      Nombre='${body.cl!.Nombre}',
      Apellidos='${body.cl!.Apellidos}',
      DNI='${body.cl!.DNI}',
      OBSERVACIONES='${
          body.cl!.OBSERVACIONES == "null" ? "-" : body.cl!.OBSERVACIONES
        }',
      usuario_actualizador='${_ctx.state.Nombre}',
      Fecha_mod = CURRENT_TIMESTAMP
      WHERE (id_cliente like '${body.cl!.id_cliente}' 
            ) AND Activo=1 `,
      );
    }
    if (body.em) {
      const [em] = await (await db()!).query(
        `UPDATE empresa set
      Razon_Social='${body.em!.Razon_Social}',
      CIF='${body.em!.CIF}',
      OBSERVACIONES='${
          body.em!.OBSERVACIONES == "null" ? "-" : body.em!.OBSERVACIONES
        }',usuario_actualizador='${_ctx.state.Nombre}',
      Fecha_mod = CURRENT_TIMESTAMP
      WHERE (id_cliente like '${body.em!.id_cliente}' 
            ) AND Activo=1 `,
      );
    }
    if (body.ct) {
      const [ct] = await (await db()!).query(
        `UPDATE contacto set
      Telefono='${body.ct!.Telefono}',
      Fijo='${body.ct!.Fijo}',
      Email='${body.ct!.Email}',
      OBSERVACIONES='${
          body.ct!.OBSERVACIONES == "null" ? "-" : body.ct!.OBSERVACIONES
        }',usuario_actualizador='${_ctx.state.Nombre}',
      Fecha_mod = CURRENT_TIMESTAMP
      WHERE (id_cliente like '${body.ct!.id_cliente}' 
            ) AND Activo=1 `,
      );
    }
    if (body.dr) {
      const [dr] = await (await db()!).query(
        `UPDATE direccion set
      direccion='${body.dr!.direccion}',
      localidad='${body.dr!.localidad}',
      municipio='${body.dr!.municipio}',
      provincia='${body.dr!.provincia}',
      codigo_postal='${body.dr!.codigo_postal}',
      OBSERVACIONES='${
          body.dr!.OBSERVACIONES == "null" ? "-" : body.dr!.OBSERVACIONES
        }',usuario_actualizador='${_ctx.state.Nombre}',
      Fecha_mod = CURRENT_TIMESTAMP
      WHERE (id_cliente like '${body.dr!.id_cliente}' 
            ) AND Activo=1 `,
      );
    }

    const res = new Response("", { status: 200 });

    return res;
  },
};
