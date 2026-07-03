import { FunctionalComponent } from "preact";
import {
  BBDD_Cliente,
  BBDD_Contacto,
  BBDD_Direccion,
  BBDD_Empresa,
} from "../../types.ts";
import { useState } from "preact/hooks";

export const Save: FunctionalComponent<
  {
    data: {
      cl?: Partial<BBDD_Cliente>;
      dr?: Partial<BBDD_Direccion>;
      ct?: Partial<BBDD_Contacto>;
      em?: Partial<BBDD_Empresa>;
    };
  }
> = ({ data }) => {
  const [saved, setsaved] = useState<string>("");
  const save = async () => {
    const body: {
      cl?: Partial<BBDD_Cliente>;
      dr?: Partial<BBDD_Direccion>;
      ct?: Partial<BBDD_Contacto>;
      em?: Partial<BBDD_Empresa>;
    } = {
      cl: data.cl!,
      dr: data.dr!,
      ct: data.ct!,
      em: data.em!,
    };
    console.log(data);

    const res = await fetch(`http://localhost:8000/Api/Updates`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    console.log("body: \n", body, "\nres: \n", res);
    const d = await res.text();
    console.log(d);

    if (res.ok) {
      console.log("Cliente insertado", res);
      setsaved("¡Guardado! ✅");
    } else {
      console.error("Error al cargar datos:", res.statusText);
      setsaved("¡Error! ❌");
    }
  };
  return (
    <div class="flex flex-row space-x-4">
      <button
        class="flex text-gray-50 bg-slate-700 px-2 border-gray-800 border-solid rounded-md border-2"
        type="button"
        onClick={save}
      >
        Guardar
      </button>
      <div>{saved}</div>
    </div>
  );
};
/*<Save
                data={{
                  cl: {
                    Nombre: cliente.Nombre,
                    Apellidos: cliente.Apellidos,
                    DNI: cliente.DNI,
                    OBSERVACIONES: cliente.OBSERVACIONES,
                  },
                }}
              />*/
