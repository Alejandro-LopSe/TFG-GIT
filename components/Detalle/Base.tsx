import { FunctionalComponent } from "preact";
import { BBDD_Cliente, BBDD_Empresa } from "../../types.ts";
import { Lable_texto } from "../Generales/Lable_texto.tsx";
import { Lable_notas } from "../Generales/Lable_notas.tsx";
import { Save } from "../../islands/buttons/Save.tsx";

export const Base: FunctionalComponent<
  { cliente: BBDD_Cliente | BBDD_Empresa }
> = (
  { cliente },
) => {
  return (
    <>
      {"CIF" in cliente
        ? (
          <div class="flex flex-col w-fit h-auto p-2">
            <label class="font-bold" value={`cliente-${cliente.id_cliente}`}>
              Datos Basicos
            </label>
            <div
              class="flex flex-col h-full items-start p-2  text-black border-gray-800 border-solid rounded-md border-2"
              id={`cliente-${cliente.id_cliente}`}
            >
              <Lable_texto label="Nombre:" texto={cliente.Razon_Social} />
              <Lable_texto label="CIF:" texto={cliente.CIF} />
              <Lable_notas
                label="OBSERVACIONES:"
                texto={cliente.OBSERVACIONES}
              />
            </div>
          </div>
        )
        : (
          <div class="flex flex-col w-fit h-auto p-2">
            <label class="font-bold" value={`cliente-${cliente.id_cliente}`}>
              Datos Basicos
            </label>
            <div
              class="flex flex-col h-full items-start p-2  text-black border-gray-800 border-solid rounded-md border-2"
              id={`cliente-${cliente.id_cliente}`}
            >
              <Lable_texto label="Nombre:" texto={cliente.Nombre} />
              <Lable_texto label="Apellidos:" texto={cliente.Apellidos} />
              <Lable_texto label="DNI:" texto={cliente.DNI} />
              <Lable_notas
                label="OBSERVACIONES:"
                texto={cliente.OBSERVACIONES}
              />
              <a
                class="flex text-gray-50 bg-slate-700 px-2 border-gray-800 border-solid rounded-md border-2"
                href={`/Clientes/Modificar/${cliente.id_cliente}`}
              >
                Modificar
              </a>
            </div>
          </div>
        )}
    </>
  );
};
