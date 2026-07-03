import { FreshContext, Handlers } from "$fresh/server.ts";
import { db } from "../../../database_conection/SQLConnection.ts";
import type { BBDD_Cliente, BBDD_Empresa } from "../../../types.ts";
import { jsonResponse } from "../../../utils/security.ts";
import {
  asNullableString,
  asPositiveInt,
  asString,
  validateRequiredFields,
} from "../../../utils/validation.ts";

type ClientePayload = [
  Partial<BBDD_Cliente>,
  Record<string, unknown>,
  Record<string, unknown>,
  Partial<BBDD_Empresa>,
  boolean,
  boolean,
];

export const handler: Handlers = {
  PUT: async (req: Request, _ctx: FreshContext) => {
    const body = await req.json().catch(() => ({})) as Record<string, unknown>;
    const url = new URL(req.url);
    const page = asPositiveInt(url.searchParams.get("pagina"), 0);
    const offset = page * 50;

    const [rows] = await db().execute(
      `SELECT *
       FROM clientes
       WHERE Nombre LIKE ?
         AND Apellidos LIKE ?
         AND DNI LIKE ?
         AND Fecha_mod LIKE ?
         AND Activo = 1
       ORDER BY id_cliente DESC
       LIMIT 50 OFFSET ?`,
      [
        `%${asString(body.Nombre)}%`,
        `%${asString(body.Apellidos)}%`,
        `%${asString(body.DNI)}%`,
        `%${asString(body.Fecha_mod)}%`,
        offset,
      ],
    );

    return jsonResponse(rows);
  },

  POST: async (req: Request, ctx: FreshContext) => {
    try {
      const body = await req.json() as ClientePayload;
      const [
        cliente,
        direccion,
        contacto,
        empresa,
        empresaNueva,
        tieneEmpresa,
      ] = body;
      const clienteData = cliente as Record<string, unknown>;

      const missing = validateRequiredFields(clienteData, [
        "Nombre",
        "Apellidos",
        "DNI",
      ]);
      if (missing.length > 0) {
        return jsonResponse({
          error: "Campos obligatorios no informados",
          missing,
        }, 400);
      }

      await db().execute(
        `INSERT INTO clientes (Nombre, Apellidos, DNI, OBSERVACIONES, usuario_actualizador, Activo)
         SELECT ?, ?, ?, ?, ?, 1
         FROM DUAL
         WHERE NOT EXISTS (
           SELECT 1 FROM clientes WHERE Nombre = ? AND Apellidos = ? AND DNI = ? AND Activo = 1
         )`,
        [
          asString(cliente.Nombre),
          asString(cliente.Apellidos),
          asString(cliente.DNI),
          asNullableString(cliente.OBSERVACIONES) ?? "-",
          ctx.state.Nombre,
          asString(cliente.Nombre),
          asString(cliente.Apellidos),
          asString(cliente.DNI),
        ],
      );

      const [clienteRows] = await db().execute(
        `SELECT * FROM clientes
         WHERE Nombre = ? AND Apellidos = ? AND DNI = ? AND Activo = 1
         ORDER BY id_cliente DESC
         LIMIT 1`,
        [
          asString(cliente.Nombre),
          asString(cliente.Apellidos),
          asString(cliente.DNI),
        ],
      );

      const newCliente = (clienteRows as BBDD_Cliente[])[0];
      if (!newCliente) {
        return jsonResponse(
          { error: "No se pudo recuperar el cliente creado" },
          500,
        );
      }

      if (tieneEmpresa) {
        if (empresaNueva) {
          await db().execute(
            `INSERT INTO empresa (Razon_Social, CIF, OBSERVACIONES, id_cliente, usuario_actualizador, Activo)
             SELECT ?, ?, ?, ?, ?, 1
             FROM DUAL
             WHERE NOT EXISTS (SELECT 1 FROM empresa WHERE CIF = ? AND Activo = 1)`,
            [
              asString(empresa.Razon_Social),
              asString(empresa.CIF),
              asNullableString(empresa.OBSERVACIONES) ?? "-",
              newCliente.id_cliente,
              ctx.state.Nombre,
              asString(empresa.CIF),
            ],
          );
        } else {
          await db().execute(
            `UPDATE empresa
             SET id_cliente = ?, usuario_actualizador = ?, Fecha_mod = CURRENT_TIMESTAMP
             WHERE Razon_Social = ? AND CIF = ? AND Activo = 1`,
            [
              newCliente.id_cliente,
              ctx.state.Nombre,
              asString(empresa.Razon_Social),
              asString(empresa.CIF),
            ],
          );
        }
      }

      await db().execute(
        `INSERT INTO direccion
          (id_cliente, direccion, localidad, codigo_postal, municipio, provincia, OBSERVACIONES, usuario_actualizador, Activo)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [
          newCliente.id_cliente,
          asString(direccion.direccion),
          asString(direccion.localidad),
          asString(direccion.codigo_postal),
          asString(direccion.municipio),
          asString(direccion.provincia),
          asNullableString(direccion.OBSERVACIONES) ?? "-",
          ctx.state.Nombre,
        ],
      );

      await db().execute(
        `INSERT INTO contacto
          (id_cliente, Telefono, Fijo, Email, OBSERVACIONES, usuario_actualizador, Activo)
         VALUES (?, ?, ?, ?, ?, ?, 1)`,
        [
          newCliente.id_cliente,
          asString(contacto.Telefono),
          asString(contacto.Fijo),
          asString(contacto.Email),
          asNullableString(contacto.OBSERVACIONES) ?? "-",
          ctx.state.Nombre,
        ],
      );

      return jsonResponse({ ok: true, id_cliente: newCliente.id_cliente }, 201);
    } catch (error) {
      console.error("Error al crear cliente:", error);
      return jsonResponse({ error: "No se pudo crear el cliente" }, 500);
    }
  },
};
