import { FreshContext, Handlers } from "$fresh/server.ts";
import { db } from "../../../database_conection/SQLConnection.ts";
import { jsonResponse } from "../../../utils/security.ts";
import { asString } from "../../../utils/validation.ts";

export const handler: Handlers = {
  GET: async (req: Request, _ctx: FreshContext) => {
    const url = new URL(req.url);
    const cif = `%${asString(url.searchParams.get("cif"))}%`;

    const [rows] = await db().execute(
      "SELECT DISTINCT CIF FROM empresa WHERE CIF LIKE ? AND Activo = 1 ORDER BY CIF LIMIT 20",
      [cif],
    );

    return jsonResponse(rows);
  },
};
