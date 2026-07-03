import { FreshContext, Handlers } from "$fresh/server.ts";
import { db } from "../../../database_conection/SQLConnection.ts";
import type { MyState, StockMovimiento } from "../../../types.ts";
import { jsonResponse } from "../../../utils/security.ts";
import { asNullableString, asPositiveInt } from "../../../utils/validation.ts";

type StockMovimientoRow = StockMovimiento & {
  nombre_articulo: string;
};

export const handler: Handlers<unknown, MyState> = {
  GET: async (req: Request, _ctx: FreshContext<MyState>) => {
    const url = new URL(req.url);
    const idArticulo = asPositiveInt(url.searchParams.get("id_articulo"));
    const page = asPositiveInt(url.searchParams.get("pagina"), 0);
    const limit = Math.min(
      asPositiveInt(url.searchParams.get("limit"), 50),
      100,
    );
    const offset = page * limit;

    const filters: string[] = [];
    const params: Array<string | number> = [];

    if (idArticulo > 0) {
      filters.push("sm.id_articulo = ?");
      params.push(idArticulo);
    }

    const fechaDesde = asNullableString(url.searchParams.get("desde"));
    if (fechaDesde) {
      filters.push("DATE(sm.fch_creacion) >= ?");
      params.push(fechaDesde);
    }

    const fechaHasta = asNullableString(url.searchParams.get("hasta"));
    if (fechaHasta) {
      filters.push("DATE(sm.fch_creacion) <= ?");
      params.push(fechaHasta);
    }

    const where = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

    const [rows] = await db().execute(
      `SELECT
          sm.id_movimiento,
          sm.id_articulo,
          a.nombre AS nombre_articulo,
          sm.tipo_movimiento,
          sm.cantidad,
          sm.cantidad_anterior,
          sm.cantidad_posterior,
          sm.motivo,
          sm.referencia,
          sm.lote,
          sm.fecha_caducidad,
          sm.usuario_actualizador,
          sm.fch_creacion
       FROM stock_movimiento sm
       JOIN articulos a ON a.id_articulo = sm.id_articulo
       ${where}
       ORDER BY sm.fch_creacion DESC, sm.id_movimiento DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset],
    );

    return jsonResponse({ data: rows as StockMovimientoRow[], page, limit });
  },
};
