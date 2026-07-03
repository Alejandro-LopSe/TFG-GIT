import { FunctionalComponent } from "preact";
import { BBDD_Cliente, BBDD_Empresa } from "../../types.ts";
import { Save } from "../buttons/Save.tsx";
import { useState } from "preact/hooks";

export const Empresa: FunctionalComponent<
  { empresa?: BBDD_Empresa | BBDD_Cliente }
> = (
  { empresa },
) => {
  const [value, setValues] = useState<Partial<BBDD_Empresa | BBDD_Cliente>>(
    { ...empresa },
  );
  if (value && "CIF" in value) {
    return (
      <div class="flex flex-col w-full h-full p-2">
        {"CIF" in value
          ? (
            <>
              <label
                class="font-bold"
                value={`value-${value.id_direccion}`}
              >
                Empresa
              </label>
              <div
                class="flex flex-row w-full h-auto items-center justify-around p-1 cursor-pointer text-black border-gray-800 border-solid rounded-md border-2 mr-2"
                id={`empresa-${value.id_empresa}`}
              >
                <div class="flex flex-row justify-start p-2  space-x-2 text-black ">
                  <div class="font-bold">{"Razon Social: "}</div>
                  <input
                    class=" pl-1 border-gray-800 border-solid rounded-md border-2"
                    value={value.Razon_Social}
                    onChange={(e) => {
                      setValues({
                        ...value,
                        Razon_Social: e.currentTarget.value,
                      });
                    }}
                  />
                </div>
                <div class="flex flex-row justify-start p-2  space-x-2 text-black ">
                  <div class="font-bold">{"CIF: "}</div>
                  <input
                    class=" pl-1 border-gray-800 border-solid rounded-md border-2"
                    value={value.CIF}
                    onChange={(e) => {
                      setValues({
                        ...value,
                        CIF: e.currentTarget.value,
                      });
                    }}
                  />
                </div>
                <div class="flex flex-col justify-start h-full p-2  space-x-2 text-black ">
                  <div class="font-bold">{"NOTAS: "}</div>
                  <textarea
                    value={value.OBSERVACIONES}
                    class="flex w-full h-1/2  border-gray-800 border-solid rounded-md border-2 p-2 text-black resize-none"
                    onChange={(e) => {
                      setValues({
                        ...value,
                        OBSERVACIONES: e.currentTarget.value,
                      });
                    }}
                  />
                </div>
                <Save
                  data={{
                    em: value,
                  }}
                />
              </div>
            </>
          )
          : ""}
      </div>
    );
  } else {
    return (
      <div class="flex flex-col w-full h-full p-2">
        {"DNI" in value
          ? (
            <>
              <label
                class="font-bold"
                value={`empresa-${value.id_cliente}`}
              >
                Cliente
              </label>

              <div
                class="flex flex-row w-full h-auto items-center justify-around p-1 cursor-pointer text-black border-gray-800 border-solid rounded-md border-2 mr-2"
                id={`empresa-${value.id_cliente}`}
              >
                <div class="flex flex-row justify-start p-2  space-x-2 text-black ">
                  <div class="font-bold">{"NOMBRE: "}</div>
                  <input
                    class=" pl-1 border-gray-800 border-solid rounded-md border-2"
                    value={value.Nombre}
                    onChange={(e) => {
                      setValues({
                        ...value,
                        Nombre: e.currentTarget.value,
                      });
                    }}
                  />
                </div>
                <div class="flex flex-row justify-start p-2  space-x-2 text-black ">
                  <div class="font-bold">{"APELLIDOS: "}</div>
                  <input
                    class=" pl-1 border-gray-800 border-solid rounded-md border-2"
                    value={value.Apellidos}
                    onChange={(e) => {
                      setValues({
                        ...value,
                        Apellidos: e.currentTarget.value,
                      });
                    }}
                  />
                </div>
                <div class="flex flex-row justify-start p-2  space-x-2 text-black ">
                  <div class="font-bold">{"DNI: "}</div>
                  <input
                    class=" pl-1 border-gray-800 border-solid rounded-md border-2"
                    value={value.DNI}
                    onChange={(e) => {
                      setValues({
                        ...value,
                        DNI: e.currentTarget.value,
                      });
                    }}
                  />
                </div>
                <div class="flex flex-col justify-start h-full p-2  space-x-2 text-black ">
                  <div class="font-bold">{"NOTAS: "}</div>
                  <textarea
                    value={value.OBSERVACIONES}
                    class="flex w-full h-1/2  border-gray-800 border-solid rounded-md border-2 p-2 text-black resize-none"
                    onChange={(e) => {
                      setValues({
                        ...value,
                        OBSERVACIONES: e.currentTarget.value,
                      });
                    }}
                  />
                </div>
                <Save
                  data={{
                    cl: value,
                  }}
                />
              </div>
            </>
          )
          : null}
      </div>
    );
  }
};
