//import { signal } from "@preact/signals-core";
import { FunctionalComponent } from "preact";
import { useEffect, useState } from "preact/hooks";
import { clientes_filtrados, filtro_clientes } from "../../signals.ts";
import { Clientes } from "../Clientes/Clientes.tsx";
import { BBDD_Cliente } from "../../types.ts";
import { Cliente } from "../Clientes/Cliente.tsx";
import { Parse_Visual_to_Date } from "../../Func.ts";

export const Filtro_Clientes: FunctionalComponent<
  { clts: BBDD_Cliente[]; pag_activa: number }
> = (
  { clts, pag_activa },
) => {
  const [data, setdata] = useState<BBDD_Cliente[]>(clts);
  const [Nombre, setN] = useState<string>("");
  const [Apellidos, setA] = useState<string>("");
  const [DNI, setD] = useState<string>("");
  const [Fecha, setF] = useState<string>("");
  const f2 = Parse_Visual_to_Date(Fecha);
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/Api/Cliente/Cliente?pagina=${pag_activa}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Nombre: Nombre,
          Apellidos: Apellidos,
          DNI: DNI,
          Fecha_mod: f2,
        }),
      });

      const d = await res.json();
      if (res.ok) {
        setdata(d);
        console.log("Datos actualizados:", d);
      } else {
        console.error("Error al cargar datos:", res.statusText);
      }
    };
    fetchData();
    console.log("effect: ", [Nombre, Apellidos, DNI, Fecha]);
  }, [Nombre, Apellidos, DNI, Fecha]);
  return (
    <div class="flex flex-col h-full w-full items-start p-2 ">
      <div class="flex flex-row justify-evenly  p-2  border-gray-700 w-full">
        <img src="filter.png" class="w-5 h-6" />
        <div class="flex flex-col  justify-start pl-5 text-black  border-gray-700 w-3/12">
          Nombre
          <input
            class="flex justify-center h-full w-fit text-black bg-slate-300 border-gray-700 rounded-md"
            value={Nombre}
            onInput={(e) => {
              setN(e.currentTarget.value);
            }}
          />
        </div>
        <img src="filter.png" class="w-5 h-6" />
        <div class="flex flex-col justify-start h-full  pl-5 text-black  border-gray-700 w-4/12">
          Apellidos
          <input
            class="flex justify-start h-full w-fit text-black bg-slate-300 border-gray-700 rounded-md"
            value={Apellidos}
            onInput={(e) => {
              setA(e.currentTarget.value);
            }}
          />
        </div>
        <img src="filter.png" class="w-5 h-6" />
        <div class="flex flex-col justify-start h-full pl-5 text-black  border-gray-700 w-3/12">
          DNI
          <input
            class="flex justify-start h-full w-fit text-black bg-slate-300 border-gray-700 rounded-md"
            value={DNI}
            onInput={(e) => {
              setD(e.currentTarget.value);
            }}
          />
        </div>
        <img src="filter.png" class="w-5 h-6" />
        <div class="flex flex-col justify-center h-full  pl-5 pr-5 text-black  border-gray-700 w-4/12">
          Ultima actualización
          <input
            class="flex justify-center h-full w-fit  text-black bg-slate-300 border-gray-700 rounded-md"
            onInput={(e) => {
              setF(e.currentTarget.value);
            }}
            value={Fecha}
          />
        </div>
      </div>

      {data.map((c: BBDD_Cliente) => {
        return (
          <Cliente c={c}>
          </Cliente>
        );
      })}
      <div class="flex flex-row justify-around pl-2 w-fit">
        Pagina:
        <a
          class="flex flex-row justify-start  pl-2 pr-2"
          href={pag_activa == 0 ? `` : `/Clientes?pagina=${pag_activa - 1}`}
        >
          <img src="arrow-left-circle.png" class="w-6 h-6" />
        </a>
        {pag_activa}
        <a
          href={`/Clientes?pagina=${pag_activa + 1}`}
          class="flex flex-row justify-start pl-2"
        >
          <img src="arrow-right-circle.png" class="w-6 h-6" />
        </a>
      </div>
    </div>
  );
};
