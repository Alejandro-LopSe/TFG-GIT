import { useEffect } from "preact/hooks";
import { FunctionalComponent } from "preact";
import { dics } from "../../types.ts";

export const ArticuloAdd: FunctionalComponent = () => {
  let dics: dics = {
    tamano: [],
    envase: [],
    iva: [],
    tipo_aceite: [],
  };
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/Api/Articulo/Articulo`, {
        method: "GET",
      });
      if (!res.ok) {
        console.error("Error fetching data:", res.statusText);
        return;
      }

      const data = await res.json();
      if (res.ok) {
        dics = data;
        console.log("Datos actualizados:", data);
      } else {
        console.error("Error al cargar datos:", res.statusText);
      }
    };
    fetchData();
  });
  return (
    <div class="flex flex-col justify-around w-full p-2">
      <div class="flex flex-col justify-around w-full p-2 text-black border-gray-800 border-solid rounded-md border-2">
        <div class="flex flex-row justify-around  text-black  w-full">
          <div class="flex flex-row justify-start  text-black  w-full">
            Envase:{" "}
            <select
              class="flex px-1 mx-1  border-solid border-2 text-black bg-slate-300 border-gray-500 rounded-md"
              value={1}
            >
              {dics.envase.map((a) => {
                return (
                  <option value={a.id} key={a.id}>
                    {a.tipo}
                  </option>
                );
              })}
            </select>
          </div>
          <div class="flex flex-row  justify-end text-black w-full">
            Tamaño:{" "}
            <select
              class="flex px-1 mx-1 border-solid border-2 text-black bg-slate-300 border-gray-500 rounded-md"
              value={1}
            >
              {dics.tamano.map((a) => {
                return <option value={a.id}>{a.tipo}</option>;
              })}
            </select>
          </div>
        </div>
        <div class="flex flex-row justify-around  text-black  w-full">
          <div class="flex flex-row  justify-start text-black w-full">
            Aceite: Madroñal
          </div>
          <div class="flex flex-row  justify-end text-black w-full">
            IVA:{" "}
            <select
              class="flex px-1 mx-1 border-solid border-2 text-black bg-slate-300 border-gray-500 rounded-md"
              value={1}
            >
              {dics.iva.map((a) => {
                return <option value={a.id}>{a.tipo}</option>;
              })}
            </select>
            %
          </div>
        </div>
        <div class="flex flex-row justify-around  text-black  w-full">
          <div class="flex flex-row   justify-start  text-black   w-full">
            Precio:
            <div class="flex flex-row  px-2 mx-2 justify-start  text-black   w-full">
              <div class="flex flex-row  px-2 mx-2 ">{`€`}</div>
              <div class="flex flex-row  px-2 mx-2 ">{`-`}</div>
              <input
                type="number"
                name="precio"
                id="precio"
                class="flex flex-row  px-2 mx-2  text-black bg-slate-300 border-gray-700 rounded-md"
                value={0.0}
              />
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-row justify-start py-1 pl-2  space-x-2  w-fit pr-1">
      </div>
    </div>
  );
};
