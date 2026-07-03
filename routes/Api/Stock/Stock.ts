import { FreshContext, Handlers } from "$fresh/server.ts";
import {
  createConnection,
  db,
} from "../../../database_conection/SQLConnection.ts";
import { jsonResponse } from "../../../utils/security.ts";
import {
  asNullableString,
  asNumber,
  asPositiveInt,
  asString,
} from "../../../utils/validation.ts";
import type {
  MyState,
  StockArticulo,
  StockMovimientoTipo,
} from "../../../types.ts";

type StockArticuloRow = {
  id_articulo: number;
  nombre: string;
  cantidad: number | string;
  precio: number | string;
  tipo_aceite: string;
  tamano: string;
  envase: string;
  stock_minimo: number | string | null;
  stock_maximo: number | string | null;
  ubicacion: string | null;
};

const TIPOS_MOVIMIENTO: StockMovimientoTipo[] = [
  "ENTRADA",
  "SALIDA",
  "AJUSTE",
  "RESERVA",
  "LIBERACION_RESERVA",
];

function normalizeNumber(value: number | string | null): number {
  if (value === null) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function estadoStock(
  cantidad: number,
  minimo: number,
): StockArticulo["estado_stock"] {
  if (cantidad <= 0) return "SIN_STOCK";
  if (minimo > 0 && cantidad <= minimo) return "BAJO_MINIMO";
  return "OK";
}

function mapArticulo(row: StockArticuloRow): StockArticulo {
  const cantidad = normalizeNumber(row.cantidad);
  const stockMinimo = normalizeNumber(row.stock_minimo);
  return {
    id_articulo: row.id_articulo,
    nombre: row.nombre,
    cantidad,
    precio: normalizeNumber(row.precio),
    tipo_aceite: row.tipo_aceite,
    tamano: row.tamano,
    envase: row.envase,
    stock_minimo: stockMinimo,
    stock_maximo: row.stock_maximo === null
      ? null
      : normalizeNumber(row.stock_maximo),
    ubicacion: row.ubicacion,
    estado_stock: estadoStock(cantidad, stockMinimo),
  };
}

function calcularStockPosterior(
  tipo: StockMovimientoTipo,
  cantidadAnterior: number,
  cantidad: number,
): number {
  switch (tipo) {
    case "ENTRADA":
    case "LIBERACION_RESERVA":
      return cantidadAnterior + cantidad;
    case "SALIDA":
    case "RESERVA":
      return cantidadAnterior - cantidad;
    case "AJUSTE":
      return cantidad;
  }
}

export const handler: Handlers<unknown, MyState> = {
  GET: async (req: Request, _ctx: FreshContext<MyState>) => {
    const url = new URL(req.url);
    const q = `%${asString(url.searchParams.get("q"))}%`;
    const estado = asString(url.searchParams.get("estado"));
    const page = asPositiveInt(url.searchParams.get("pagina"), 0);
    const limit = Math.min(
      asPositiveInt(url.searchParams.get("limit"), 25),
      100,
    );
    const offset = page * limit;

    const [rows] = await db().execute(
      `SELECT
          a.id_articulo,
          a.nombre,
          a.cantidad,
          a.precio,
          da.tipo AS tipo_aceite,
          dt.tipo AS tamano,
          de.tipo AS envase,
          COALESCE(sc.stock_minimo, 0) AS stock_minimo,
          sc.stock_maximo,
          sc.ubicacion
       FROM articulos a
       JOIN dic_aceite da ON da.id = a.tipo_aceite
       JOIN dic_tamano dt ON dt.id = a.tamano
       JOIN dic_envase de ON de.id = a.envase
       LEFT JOIN stock_configuracion sc ON sc.id_articulo = a.id_articulo AND sc.activo = 1
       WHERE a.nombre LIKE ?
       ORDER BY a.nombre
       LIMIT ? OFFSET ?`,
      [q, limit, offset],
    );

    let data = (rows as StockArticuloRow[]).map(mapArticulo);
    if (["OK", "BAJO_MINIMO", "SIN_STOCK"].includes(estado)) {
      data = data.filter((articulo) => articulo.estado_stock === estado);
    }

    return jsonResponse({ data, page, limit });
  },

  POST: async (req: Request, ctx: FreshContext<MyState>) => {
    const body = await req.json().catch(() => ({})) as Record<string, unknown>;
    const idArticulo = asPositiveInt(body.id_articulo);
    const tipo = asString(body.tipo_movimiento)
      .toUpperCase() as StockMovimientoTipo;
    const cantidad = asNumber(body.cantidad);
    const motivo = asString(body.motivo);

    if (!idArticulo || !TIPOS_MOVIMIENTO.includes(tipo)) {
      return jsonResponse(
        { error: "Artículo o tipo de movimiento no válido" },
        400,
      );
    }
    if (cantidad <= 0 && tipo !== "AJUSTE") {
      return jsonResponse(
        { error: "La cantidad debe ser mayor que cero" },
        400,
      );
    }
    if (cantidad < 0 && tipo === "AJUSTE") {
      return jsonResponse(
        { error: "El stock ajustado no puede ser negativo" },
        400,
      );
    }
    if (!motivo) {
      return jsonResponse(
        { error: "El motivo del movimiento es obligatorio" },
        400,
      );
    }

    const connection = await createConnection().getConnection();
    try {
      await connection.beginTransaction();

      const [articulos] = await connection.execute(
        "SELECT id_articulo, cantidad FROM articulos WHERE id_articulo = ? FOR UPDATE",
        [idArticulo],
      );
      const articulo = (articulos as Array<
        { id_articulo: number; cantidad: number | string }
      >)[0];
      if (!articulo) {
        await connection.rollback();
        return jsonResponse({ error: "Artículo no encontrado" }, 404);
      }

      const cantidadAnterior = normalizeNumber(articulo.cantidad);
      const cantidadPosterior = calcularStockPosterior(
        tipo,
        cantidadAnterior,
        cantidad,
      );
      if (cantidadPosterior < 0) {
        await connection.rollback();
        return jsonResponse({
          error: "La operación dejaría el stock en negativo",
        }, 409);
      }

      await connection.execute(
        `UPDATE articulos
         SET cantidad = ?, usuario_actualizador = ?
         WHERE id_articulo = ?`,
        [cantidadPosterior, ctx.state.Nombre, idArticulo],
      );

      await connection.execute(
        `INSERT INTO stock_movimiento
          (id_articulo, tipo_movimiento, cantidad, cantidad_anterior, cantidad_posterior,
           motivo, referencia, lote, fecha_caducidad, usuario_actualizador)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          idArticulo,
          tipo,
          cantidad,
          cantidadAnterior,
          cantidadPosterior,
          motivo,
          asNullableString(body.referencia),
          asNullableString(body.lote),
          asNullableString(body.fecha_caducidad),
          ctx.state.Nombre,
        ],
      );

      await connection.commit();
      return jsonResponse({
        ok: true,
        id_articulo: idArticulo,
        cantidad_anterior: cantidadAnterior,
        cantidad_posterior: cantidadPosterior,
      }, 201);
    } catch (error) {
      await connection.rollback();
      console.error("Error al registrar movimiento de stock:", error);
      return jsonResponse({
        error: "No se pudo registrar el movimiento de stock",
      }, 500);
    } finally {
      connection.release();
    }
  },

  PUT: async (req: Request, ctx: FreshContext<MyState>) => {
    const body = await req.json().catch(() => ({})) as Record<string, unknown>;
    const idArticulo = asPositiveInt(body.id_articulo);
    if (!idArticulo) {
      return jsonResponse({ error: "id_articulo obligatorio" }, 400);
    }

    await db().execute(
      `INSERT INTO stock_configuracion
        (id_articulo, stock_minimo, stock_maximo, ubicacion, usuario_actualizador)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        stock_minimo = VALUES(stock_minimo),
        stock_maximo = VALUES(stock_maximo),
        ubicacion = VALUES(ubicacion),
        usuario_actualizador = VALUES(usuario_actualizador),
        activo = 1`,
      [
        idArticulo,
        asNumber(body.stock_minimo),
        body.stock_maximo === null || body.stock_maximo === ""
          ? null
          : asNumber(body.stock_maximo),
        asNullableString(body.ubicacion),
        ctx.state.Nombre,
      ],
    );

    return jsonResponse({ ok: true });
  },
};
