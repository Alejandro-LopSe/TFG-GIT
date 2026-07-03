//import { signal } from "@preact/signals-core";
import { FunctionalComponent } from "preact";
import { useState } from "preact/hooks";
import { BBDD_Articulo } from "../../types.ts";
import { Articulos_Lista } from "../../components/Articulos_V2/Articulos_Lista.tsx";

export const Filtro_Articulos: FunctionalComponent<{
  arts: BBDD_Articulo[];
}> = ({ arts }) => {
  const [data, setdata] = useState<BBDD_Articulo[]>(arts);
  const [Nombre, setN] = useState<string>("");

  const filtrar = (nombre: string) => {
    setdata(
      arts.filter((a) => {
        if (a.nombre.toLowerCase().includes(nombre.toLowerCase())) return true;
        else return false;
      })
    );
  };

  return (
    <div class="flex flex-row justify-start pl-1 text-black  border-gray-700 w-full">
      <div class="flex flex-col justify-start pl-1 text-black  border-gray-700 w-full">
        <div class="flex flex-row  justify-start pl-3 text-black  border-gray-700 w-3/12">
          <img src="filter.png" class="w-5 h-6" /> Nombre
          <input
            class="flex justify-center mx-2  h-full w-fit text-black bg-slate-300 border-gray-700 rounded-md"
            value={Nombre}
            onInput={(e) => {
              filtrar(e.currentTarget.value);
              setN(e.currentTarget.value);
            }}
          />
        </div>
        <div class="flex flex-row justify-start  p-2  border-gray-700 w-full">
          <Articulos_Lista articulos={data}></Articulos_Lista>
        </div>
      </div>
    </div>
  );
};
