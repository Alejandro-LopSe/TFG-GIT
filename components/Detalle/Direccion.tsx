import { FunctionalComponent } from "preact";
import { BBDD_Direccion } from "../../types.ts";
import { Lable_texto } from "../Generales/Lable_texto.tsx";
import { Lable_notas } from "../Generales/Lable_notas.tsx";

export const Direccion: FunctionalComponent<{ direccion?: BBDD_Direccion }> = (
  { direccion },
) => {
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
              <Lable_texto
                label="Calle:"
                texto={direccion.direccion}
              />
              <Lable_texto label="Localidad:" texto={direccion.localidad} />
              <Lable_texto label="Provincia:" texto={direccion.provincia} />
              <Lable_texto label="CP:" texto={direccion.codigo_postal} />
              <Lable_notas
                label="OBSERVACIONES:"
                texto={direccion.OBSERVACIONES}
              />
            </div>
          </>
        )
        : null}
    </div>
  );
};
