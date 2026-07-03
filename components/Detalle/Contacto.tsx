import { FunctionalComponent } from "preact";
import { BBDD_Contacto } from "../../types.ts";
import { Lable_texto } from "../Generales/Lable_texto.tsx";
import { Lable_notas } from "../Generales/Lable_notas.tsx";
import { Lable_texto_first } from "../Generales/Lable_texto_first.tsx";

export const Contacto: FunctionalComponent<{ contacto?: BBDD_Contacto }> = (
  { contacto },
) => {
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
              <Lable_texto_first
                activo={contacto.activo}
                label="Telefono 1:"
                texto={contacto.Telefono}
              />
              <Lable_texto label="Telefono 2:" texto={contacto.Fijo} />
              <Lable_texto label="Email:" texto={contacto.Email} />
              <Lable_notas
                label="OBSERVACIONES:"
                texto={contacto.OBSERVACIONES}
              />
            </div>
          </>
        )
        : null}
    </div>
  );
};
