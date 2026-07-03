import { FreshContext, Handlers } from "$fresh/server.ts";
import { db } from "../../../database_conection/SQLConnection.ts";
import { jsonResponse } from "../../../utils/security.ts";
import { asString } from "../../../utils/validation.ts";

export const handler: Handlers = {
  GET: async (req: Request, _ctx: FreshContext) => {
    const url = new URL(req.url);
    const cif = asString(url.searchParams.get("cif"));

    if (!cif) {
      return jsonResponse({ error: "El parámetro cif es obligatorio" }, 400);
    }

    const [rows] = await db().execute(
      "SELECT * FROM empresa WHERE CIF = ? AND Activo = 1 LIMIT 1",
      [cif],
    );

    return jsonResponse(rows);
  },
};
