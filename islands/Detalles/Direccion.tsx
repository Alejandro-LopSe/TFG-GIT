import { FunctionalComponent } from "preact";
import { BBDD_Direccion } from "../../types.ts";
import { Save } from "../buttons/Save.tsx";
import { useState } from "preact/hooks";
export const Direccion: FunctionalComponent<{ direccion?: BBDD_Direccion }> = (
  { direccion },
) => {
  const [value, setValues] = useState<Partial<BBDD_Direccion>>(
    { ...direccion },
  );
  return (
    <div class="flex flex-col w-full h-full p-2">
      {direccion
        ? (
          <>
            <label
              class="font-bold"
              value={`direccion-${direccion.id_direccion}`}
            >
              Dirección
            </label>
            <div
              class="flex flex-row w-full h-auto items-center justify-around p-1 text-black border-gray-800 border-solid rounded-md border-2 mr-2"
              id={`direccion-${direccion.id_direccion}`}
            >
              <div class="flex flex-col justify-start p-2  space-x-2 text-black ">
                <div class="font-bold">{"Dirección: "}</div>
                <input
                  class=" pl-1 border-gray-800 border-solid rounded-md border-2"
                  value={value.direccion}
                  onChange={(e) => {
                    setValues({
                      ...value,
                      direccion: e.currentTarget.value,
                    });
                  }}
                />
              </div>
              <div class="flex flex-col justify-start p-2  space-x-2 text-black ">
                <div class="font-bold">{"Localidad: "}</div>
                <input
                  class=" pl-1 border-gray-800 border-solid rounded-md border-2"
                  value={value.localidad}
                  onChange={(e) => {
                    setValues({
                      ...value,
                      localidad: e.currentTarget.value,
                    });
                  }}
                />
              </div>
              <div class="flex flex-col justify-start p-2  space-x-2 text-black ">
                <div class="font-bold">{"Municipio: "}</div>
                <input
                  class=" pl-1 border-gray-800 border-solid rounded-md border-2"
                  value={value.municipio}
                  onChange={(e) => {
                    setValues({
                      ...value,
                      municipio: e.currentTarget.value,
                    });
                  }}
                />
              </div>
              <div class="flex flex-col justify-start p-2  space-x-2 text-black ">
                <div class="font-bold">{"Provincia: "}</div>
                <input
                  class=" pl-1 border-gray-800 border-solid rounded-md border-2"
                  value={value.provincia}
                  onChange={(e) => {
                    setValues({
                      ...value,
                      provincia: e.currentTarget.value,
                    });
                  }}
                />
              </div>
              <div class="flex flex-col justify-start p-2  space-x-2 text-black ">
                <div class="font-bold">{"CP: "}</div>
                <input
                  class=" pl-1 border-gray-800 border-solid rounded-md border-2"
                  value={value.codigo_postal}
                  onChange={(e) => {
                    setValues({
                      ...value,
                      codigo_postal: e.currentTarget.value,
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
                  dr: value,
                }}
              />
            </div>
          </>
        )
        : null}
    </div>
  );
};
