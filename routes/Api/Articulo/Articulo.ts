import { FreshContext, Handlers } from "$fresh/server.ts";
import { db } from "../../../database_conection/SQLConnection.ts";
import type { BBDD_Articulo } from "../../../types.ts";
import { jsonResponse } from "../../../utils/security.ts";
import {
  asNumber,
  asPositiveInt,
  asString,
  validateRequiredFields,
} from "../../../utils/validation.ts";

function mapArticulo(row: any): BBDD_Articulo {
  return {
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
  };
}

export const handler: Handlers = {
  PUT: async (req: Request, _ctx: FreshContext) => {
    const body = await req.json().catch(() => ({}));
    const url = new URL(req.url);
    const page = asPositiveInt(url.searchParams.get("pagina"), 0);
    const offset = page * 20;
    const nombre = `%${asString((body as Record<string, unknown>).nombre)}%`;

    const [rows] = await db().execute(
      `SELECT
          a.id_articulo,
          a.nombre AS articulo_nombre,
          a.precio,
          a.cantidad,
          a.OBSERVACIONES AS articulo_observaciones,
          da.id AS aceite_id,
          da.tipo AS aceite_tipo,
          da.OBSERVACIONES AS aceite_observaciones,
          dt.id AS tamano_id,
          dt.tipo AS tamano_tipo,
          dt.OBSERVACIONES AS tamano_observaciones,
          de.id AS envase_id,
          de.tipo AS envase_tipo,
          de.OBSERVACIONES AS envase_observaciones,
          i.id AS iva_id,
          i.tipo AS iva_tipo,
          i.actualizado AS iva_actualizado,
          i.usuario_actualizador AS iva_usuario
       FROM articulos a
       JOIN dic_aceite da ON da.id = a.tipo_aceite
       JOIN dic_tamano dt ON dt.id = a.tamano
       JOIN dic_envase de ON de.id = a.envase
       JOIN iva i ON i.id = a.Tipo_IVA
       WHERE a.nombre LIKE ?
       ORDER BY a.id_articulo DESC
       LIMIT 20 OFFSET ?`,
      [nombre, offset],
    );

    return jsonResponse((rows as any[]).map(mapArticulo));
  },

  GET: async (_req: Request, _ctx: FreshContext) => {
    const [aceite] = await db().execute(
      `SELECT id AS aceite_id, tipo AS aceite_tipo, OBSERVACIONES AS aceite_observaciones
       FROM dic_aceite
       ORDER BY tipo`,
    );
    const [tamano] = await db().execute(
      `SELECT id AS tamano_id, tipo AS tamano_tipo, OBSERVACIONES AS tamano_observaciones
       FROM dic_tamano
       ORDER BY tipo`,
    );
    const [envase] = await db().execute(
      `SELECT id AS envase_id, tipo AS envase_tipo, OBSERVACIONES AS envase_observaciones
       FROM dic_envase
       ORDER BY tipo`,
    );
    const [iva] = await db().execute(
      `SELECT id AS iva_id, tipo AS iva_tipo, actualizado AS iva_actualizado, usuario_actualizador AS iva_usuario
       FROM iva
       ORDER BY tipo`,
    );

    return jsonResponse({
      tipo_aceite: aceite,
      tamano,
      envase,
      Tipo_IVA: iva,
    });
  },

  POST: async (req: Request, ctx: FreshContext) => {
    try {
      const body = await req.json() as Record<string, unknown>;
      const missing = validateRequiredFields(body, [
        "nombre",
        "precio",
        "cantidad",
        "tipo_aceite",
        "envase",
        "tamano",
        "Tipo_IVA",
      ]);

      if (missing.length > 0) {
        return jsonResponse({
          error: "Campos obligatorios no informados",
          missing,
        }, 400);
      }

      await db().execute(
        `INSERT INTO articulos
          (nombre, precio, cantidad, tipo_aceite, usuario_actualizador, envase, tamano, Tipo_IVA, OBSERVACIONES)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          asString(body.nombre),
          asNumber(body.precio),
          asNumber(body.cantidad),
          asPositiveInt(body.tipo_aceite),
          ctx.state.Nombre,
          asPositiveInt(body.envase),
          asPositiveInt(body.tamano),
          asPositiveInt(body.Tipo_IVA),
          asString(body.OBSERVACIONES, "-"),
        ],
      );

      return jsonResponse({ ok: true }, 201);
    } catch (error) {
      console.error("Error al crear artículo:", error);
      return jsonResponse({ error: "No se pudo crear el artículo" }, 500);
    }
  },
};
