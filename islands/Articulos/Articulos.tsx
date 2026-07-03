import { FunctionalComponent } from "preact";
import { BBDD_Articulo } from "../../types.ts";
import { Articulo } from "./Articulo.tsx";
import { filtro_clientes } from "../../signals.ts";
import { useEffect, useState } from "preact/hooks";

export const Clientes: FunctionalComponent<
  { arts: BBDD_Articulo[]; pag_activa: number }
> = (
  { arts, pag_activa },
) => {
  const [data, setdata] = useState<BBDD_Articulo[]>(arts);
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/Api/Cliente?pagina=${pag_activa}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Nombre: filtro_clientes.value?.Nombre,
          Apellidos: filtro_clientes.value?.Apellidos,
          DNI: filtro_clientes.value?.DNI,
        }),
      });
      console.log(filtro_clientes.value);

      const d = await res.json();
      if (res.ok) {
        setdata(d);
        console.log("Datos actualizados:", d);
      } else {
        console.error("Error al cargar datos:", res.statusText);
      }
    };
    fetchData();
    console.log("effect: ", filtro_clientes.value);
  }, [filtro_clientes.value]);
  console.log(filtro_clientes.value);

  return (
    <div class="flex flex-col h-full w-full items-start p-2  text-black border-gray-800 border-solid rounded-md border-2">
      {data.map((a: BBDD_Articulo) => {
        return (
          <Articulo a={a}>
          </Articulo>
        );
      })}
      <div>
        Pagina:<a
          href={pag_activa == 0 ? `` : `/Clientes?pagina=${pag_activa - 1}`}
        >
          {"<< "}
        </a>{" "}
        {pag_activa}
        <a href={`/Clientes?pagina=${pag_activa + 1}`}>{" >>"}</a>
      </div>
    </div>
  );
};
