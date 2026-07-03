import { FunctionalComponent } from "preact";
import {
  BBDD_Aceite,
  BBDD_Articulo,
  BBDD_Envase,
  BBDD_IVA,
  BBDD_Tamano,
} from "../../types.ts";
import { Signal } from "@preact/signals-core";
import { Articulo } from "../../islands/Articulos/Articulo.tsx";

export const Desplegable: FunctionalComponent<{
  art: Signal<Partial<BBDD_Articulo>>;
  arr:
    | BBDD_IVA[]
    | BBDD_Aceite[]
    | BBDD_Tamano[]
    | BBDD_Envase[]
    | BBDD_Articulo[];
}> = ({ art, arr }) => {
  console.log(
    arr,

    arr[0].iloc
    //
  );

  return (
    <select
      name=""
      id={Object.values(arr).toString()}
      class="flex px-1 mx-1 border-gray-300 border-solid rounded-md border-2">
      {arr.map((a) => {
        return (
          //@ts-expect-error check always exists
          <option value={a.id} key={a.id}>
            {
              //@ts-expect-error check always exists
              a.tipo
            }
          </option>
        );
      })}
    </select>
  );
};
