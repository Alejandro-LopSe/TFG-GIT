import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { Base } from "../../components/Detalle/Base.tsx";
import { Contacto } from "../../components/Detalle/Contacto.tsx";
import { Direccion } from "../../components/Detalle/Direccion.tsx";
import { Empresa } from "../../components/Detalle/Empresa.tsx";
import { db } from "../../database_conection/SQLConnection.ts";
import {
  BBDD_Cliente,
  BBDD_Contacto,
  BBDD_Direccion,
  BBDD_Empresa,
  MyState,
} from "../../types.ts";

export const handler: Handlers<
  {
    cliente: BBDD_Empresa;
    contacto?: BBDD_Contacto;
    direccion?: BBDD_Direccion;
    empresa?: BBDD_Cliente;
  },
  MyState
> = {
  //@ts-expect-error ctx.params is always defined
  async GET(
    _req: Request,
    ctx: FreshContext<
      MyState,
      {
        cliente: BBDD_Empresa;
        contacto?: BBDD_Contacto;
        direccion?: BBDD_Direccion;
        empresa?: BBDD_Cliente;
      }
    >,
  ) {
    const id = ctx.params.id;
    if (id) {
      const [em] = await (await db()!).query(
        `SELECT * FROM fabrica.empresa WHERE id_empresa=${id} AND Activo=1 `,
      );
      //@ts-expect-error check always exists
      if (em.length > 0) {
        //@ts-expect-error check always exists
        const empresa: BBDD_Empresa = em[0];
        console.log(empresa);

        const [cli] = await (await db()!).query(
          `SELECT * FROM fabrica.clientes WHERE id_cliente=${empresa.id_cliente} AND Activo=1 `,
        );

        const [cont] = await (await db()!).query(
          `SELECT * FROM fabrica.contacto WHERE id_empresa=${id} `,
        );
        const [dir] = await (await db()!).query(
          `SELECT * FROM fabrica.direccion WHERE id_empresa=${id} `,
        );

        const data = {
          cliente: empresa,
          //@ts-expect-error check always exists
          contacto: cont.length > 0 ? cont[0] : undefined,
          //@ts-expect-error check always exists
          direccion: dir.length > 0 ? dir[0] : undefined,
          //@ts-expect-error check always exists
          empresa: cli.length > 0 ? cli[0] : undefined,
        };
        return ctx.render(data);
      }
      return new Response("Not Found", { status: 404 });
    }
  },
};

export default function Home(
  props: PageProps<
    {
      cliente: BBDD_Empresa;
      contacto?: BBDD_Contacto;
      direccion?: BBDD_Direccion;
      empresa?: BBDD_Cliente;
    },
    MyState
  >,
) {
  console.log("Props: ", props.data);

  return (
    <div class="flex flex-row justify-start min-h-[calc(100dvh-5rem)] min-w-[calc(100dvw-6rem)]">
      <Base cliente={props.data.cliente}></Base>
      <div class="flex flex-col justify-start w-full h-min">
        <Contacto contacto={props.data.contacto}></Contacto>
        <Direccion direccion={props.data.direccion}></Direccion>
        <Empresa empresa={props.data.empresa}></Empresa>
      </div>
    </div>
  );
}
