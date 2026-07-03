import { FreshContext, Handlers } from "$fresh/server.ts";
import { db } from "../../../database_conection/SQLConnection.ts";
import { MyState } from "../../../types.ts";

export const handler: Handlers<unknown, MyState> = {
  GET: async (_req: Request, _ctx: FreshContext<MyState, unknown>) => {
    const url = new URL(_req.url);
    const cif = url.searchParams.get("cif");
    const [exist] = await (await db()!).query(
      `SELECT * FROM empresa where CIF = '${cif}'`,
    );
    console.log(cif);

    const res = new Response(JSON.stringify(exist));

    return res;
  },
};
