import { FunctionalComponent } from "preact";
import { BBDD_Articulo } from "../../types.ts";
import { Articulo_Unitario } from "./articulo_unitario.tsx";

export const Articulos_Lista: FunctionalComponent<{
  articulos: BBDD_Articulo[];
}> = ({ articulos }) => {
  const lista_mad: BBDD_Articulo[] = articulos.filter(
    (a) => a.tipo_aceite.id === 1 && a.Tipo_IVA.id === 1
  );
  const lista_do: BBDD_Articulo[] = articulos.filter(
    (a) => a.tipo_aceite.id === 2 && a.Tipo_IVA.id === 1
  );
  const lista_esp: BBDD_Articulo[] = articulos.filter(
    (a) => a.Tipo_IVA.id !== 1
  );

  return (
    <>
      <div class="flex flex-col justify-start  p-2  border-gray-700 w-full">
        Madroñal
        <div class="flex flex-col h-full w-full items-start p-2 border-solid border-2 border-gray-700 rounded-md">
          {lista_mad.map((a) => (
            <Articulo_Unitario a={a} key={a.id_articulo} />
          ))}
          <a class="flex flex-row justify-start pl-2" href="/Articulos/Añadir">
            <img src="plus-circle_fabrica.png" class="w-6 h-6" />
          </a>
        </div>
      </div>
      <div class="flex flex-col justify-start  p-2  border-gray-700 w-full">
        Denominacio de Origen
        <div class="flex flex-col h-full w-full items-start p-2 border-solid border-2 border-gray-700 rounded-md">
          {lista_do.map((a) => (
            <Articulo_Unitario a={a} key={a.id_articulo} />
          ))}
          <a class="flex flex-row justify-start pl-2" href="/Articulos/Añadir">
            <img src="plus-circle_fabrica.png" class="w-6 h-6" />
          </a>
        </div>
      </div>
      <div class="flex flex-col justify-start  p-2  border-gray-700 w-full">
        Especiales
        <div class="flex flex-col h-full w-full items-start p-2 border-solid border-2 border-gray-700 rounded-md">
          {lista_esp.map((a) => (
            <Articulo_Unitario a={a} key={a.id_articulo} />
          ))}
          <a class="flex flex-row justify-start pl-2" href="/Articulos/Añadir">
            <img src="plus-circle_fabrica.png" class="w-6 h-6" />
          </a>
        </div>
      </div>
    </>
  );
};
