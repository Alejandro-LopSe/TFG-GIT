import { FunctionalComponent } from "preact";
import { BBDD_Cliente, BBDD_Empresa } from "../../types.ts";
import { Lable_texto } from "../Generales/Lable_texto.tsx";
import { Lable_notas } from "../Generales/Lable_notas.tsx";

export const Empresa: FunctionalComponent<
  { empresa?: BBDD_Empresa | BBDD_Cliente }
> = (
  { empresa },
) => {
  if (empresa && "CIF" in empresa) {
    const info_Empresa = () => {
      console.log(`Empresa seleccionada: ${empresa!.id_direccion}`);

      globalThis.location.href = `/Empresas/${empresa!.id_empresa}`;
    };
    return (
      <div class="flex flex-col w-full h-full p-2">
        {empresa
          ? (
            <>
              <label
                class="font-bold"
                value={`empresa-${empresa.id_direccion}`}
                onClick={() => {
                  console.log(
                    `Empresa seleccionada label: ${empresa!.id_direccion}`,
                  );
                  info_Empresa();
                }}
              >
                Empresa
              </label>

              <a
                class="flex flex-row w-full h-auto items-center justify-around p-1 cursor-pointer text-black border-gray-800 border-solid rounded-md border-2 mr-2"
                id={`empresa-${empresa.id_direccion}`}
                href={`/Empresas/${empresa!.id_empresa}`}
              >
                <Lable_texto
                  label="Razon Social:"
                  texto={empresa.Razon_Social}
                />
                <Lable_texto label="CIF:" texto={empresa.CIF} />
                <Lable_notas
                  label="OBSERVACIONES:"
                  texto={empresa.OBSERVACIONES}
                />
              </a>
            </>
          )
          : null}
      </div>
    );
  } else {
    const info_Empresa = () => {
      globalThis.location.href = `/Clientes/${empresa!.id_cliente}`;
    };
    return (
      <div class="flex flex-col w-full h-full p-2">
        {empresa
          ? (
            <>
              <label
                class="font-bold"
                value={`empresa-${empresa.id_cliente}`}
                onClick={() => {
                  console.log(
                    `Empresa seleccionada label: ${empresa!.id_cliente}`,
                  );
                  info_Empresa();
                }}
              >
                Cliente
              </label>

              <a
                class="flex flex-row w-full h-auto items-center justify-around p-1 cursor-pointer text-black border-gray-800 border-solid rounded-md border-2 mr-2"
                id={`empresa-${empresa.id_cliente}`}
                href={`/Clientes/${empresa!.id_cliente}`}
              >
                <Lable_texto label="Nombre:" texto={empresa.Nombre} />
                <Lable_texto label="Apellidos:" texto={empresa.Apellidos} />
                <Lable_texto label="DNI:" texto={empresa.DNI} />
                <Lable_notas
                  label="OBSERVACIONES:"
                  texto={empresa.OBSERVACIONES}
                />
              </a>
            </>
          )
          : null}
      </div>
    );
  }
};
