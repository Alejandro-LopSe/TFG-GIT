import { FunctionalComponent } from "preact";
import { BBDD_Contacto } from "../../types.ts";
import { Save } from "../buttons/Save.tsx";
import { useState } from "preact/hooks";

export const Contacto: FunctionalComponent<{ contacto?: BBDD_Contacto }> = (
  { contacto },
) => {
  const [value, setValues] = useState<Partial<BBDD_Contacto>>(
    { ...contacto },
  );
  return (
    <div class="flex flex-col w-full h-full p-2">
      {contacto
        ? (
          <>
            <label class="font-bold" value={`cliente-${contacto.id_contacto}`}>
              Contacto
            </label>
            <div
              class="flex flex-row w-full h-fit items-center justify-around p-1 text-black border-gray-800 border-solid rounded-md border-2 mr-2"
              id={`cliente-${contacto.id_contacto}`}
            >
              <div class="flex flex-row justify-start p-2  space-x-2 text-black ">
                <div class="font-bold">{"Telefono 1: "}</div>
                <input
                  class=" pl-1 border-gray-800 border-solid rounded-md border-2"
                  value={value.Telefono}
                  onChange={(e) => {
                    setValues({
                      ...value,
                      Telefono: e.currentTarget.value,
                    });
                  }}
                />
              </div>
              <div class="flex flex-row justify-start p-2  space-x-2 text-black ">
                <div class="font-bold">{"Telefono 2: "}</div>
                <input
                  class=" pl-1 border-gray-800 border-solid rounded-md border-2"
                  value={value.Fijo}
                  onChange={(e) => {
                    setValues({
                      ...value,
                      Fijo: e.currentTarget.value,
                    });
                  }}
                />
              </div>
              <div class="flex flex-row justify-start p-2  space-x-2 text-black ">
                <div class="font-bold">{"Email: "}</div>
                <input
                  class=" pl-1 border-gray-800 border-solid rounded-md border-2"
                  value={value.Email}
                  onChange={(e) => {
                    setValues({
                      ...value,
                      Email: e.currentTarget.value,
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
                  ct: value,
                }}
              />
            </div>
          </>
        )
        : null}
    </div>
  );
};
