import { FreshContext, Handlers } from "$fresh/server.ts";
import { db } from "../../database_conection/SQLConnection.ts";
import { jsonResponse } from "../../utils/security.ts";
import {
  asNullableString,
  asPositiveInt,
  asString,
} from "../../utils/validation.ts";

type UpdateBody = {
  cl?: Record<string, unknown>;
  dr?: Record<string, unknown>;
  ct?: Record<string, unknown>;
  em?: Record<string, unknown>;
};

export const handler: Handlers = {
  PUT: async (req: Request, ctx: FreshContext) => {
    try {
      const body = await req.json() as UpdateBody;
      const updated: string[] = [];

      if (body.cl) {
        const idCliente = asPositiveInt(body.cl.id_cliente);
        if (!idCliente) {
          return jsonResponse({ error: "id_cliente obligatorio" }, 400);
        }

        await db().execute(
          `UPDATE clientes
           SET Nombre = ?, Apellidos = ?, DNI = ?, OBSERVACIONES = ?, usuario_actualizador = ?, Fecha_mod = CURRENT_TIMESTAMP
           WHERE id_cliente = ? AND Activo = 1`,
          [
            asString(body.cl.Nombre),
            asString(body.cl.Apellidos),
            asString(body.cl.DNI),
            asNullableString(body.cl.OBSERVACIONES) ?? "-",
            ctx.state.Nombre,
            idCliente,
          ],
        );
        updated.push("cliente");
      }

      if (body.em) {
        const idCliente = asPositiveInt(body.em.id_cliente);
        if (!idCliente) {
          return jsonResponse(
            { error: "id_cliente obligatorio para empresa" },
            400,
          );
        }

        await db().execute(
          `UPDATE empresa
           SET Razon_Social = ?, CIF = ?, OBSERVACIONES = ?, usuario_actualizador = ?, Fecha_mod = CURRENT_TIMESTAMP
           WHERE id_cliente = ? AND Activo = 1`,
          [
            asString(body.em.Razon_Social),
            asString(body.em.CIF),
            asNullableString(body.em.OBSERVACIONES) ?? "-",
            ctx.state.Nombre,
            idCliente,
          ],
        );
        updated.push("empresa");
      }

      if (body.ct) {
        const idCliente = asPositiveInt(body.ct.id_cliente);
        if (!idCliente) {
          return jsonResponse(
            { error: "id_cliente obligatorio para contacto" },
            400,
          );
        }

        await db().execute(
          `UPDATE contacto
           SET Telefono = ?, Fijo = ?, Email = ?, OBSERVACIONES = ?, usuario_actualizador = ?, Fecha_mod = CURRENT_TIMESTAMP
           WHERE id_cliente = ? AND Activo = 1`,
          [
            asString(body.ct.Telefono),
            asString(body.ct.Fijo),
            asString(body.ct.Email),
            asNullableString(body.ct.OBSERVACIONES) ?? "-",
            ctx.state.Nombre,
            idCliente,
          ],
        );
        updated.push("contacto");
      }

      if (body.dr) {
        const idCliente = asPositiveInt(body.dr.id_cliente);
        if (!idCliente) {
          return jsonResponse({
            error: "id_cliente obligatorio para dirección",
          }, 400);
        }

        await db().execute(
          `UPDATE direccion
           SET direccion = ?, localidad = ?, municipio = ?, provincia = ?, codigo_postal = ?, OBSERVACIONES = ?, usuario_actualizador = ?, Fecha_mod = CURRENT_TIMESTAMP
           WHERE id_cliente = ? AND Activo = 1`,
          [
            asString(body.dr.direccion),
            asString(body.dr.localidad),
            asString(body.dr.municipio),
            asString(body.dr.provincia),
            asString(body.dr.codigo_postal),
            asNullableString(body.dr.OBSERVACIONES) ?? "-",
            ctx.state.Nombre,
            idCliente,
          ],
        );
        updated.push("direccion");
      }

      return jsonResponse({ ok: true, updated });
    } catch (error) {
      console.error("Error al actualizar datos:", error);
      return jsonResponse(
        { error: "No se pudieron actualizar los datos" },
        500,
      );
    }
  },
};
