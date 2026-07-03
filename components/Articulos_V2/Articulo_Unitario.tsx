import { FunctionalComponent } from "preact";
import { BBDD_Articulo } from "../../types.ts";

export const Articulo_Unitario: FunctionalComponent<{ a: BBDD_Articulo }> = ({
  a,
}) => {
  const s = `${a.envase.tipo}${a.tipo_aceite.id == 1 ? "MAD" : "DO"}.png`;
  console.log("Articulo_Unitario", s);

  return (
    <div
      class="flex flex-col justify-between w-full p-2 
       text-black bg-slate-300 mb-1 border-gray-800 border-solid rounded-md border-2"
      id={`articulo-${a.id_articulo}`}>
      <div class="flex flex-row justify-between  text-black  w-full">
        <div class="flex flex-row justify-start  text-black  w-fit">
          <img src={s} class="w-8 mr-7 h-10" />
          {a.nombre}
        </div>
        <div class="flex flex-row  justify-end text-black w-fit">
          {`IVA: ${a.Tipo_IVA.tipo} %`}
        </div>
      </div>
      <div class="flex flex-row  justify-end text-black w-full">
        {`${a.cantidad} uds.`}
      </div>

      <div class="flex flex-row  justify-end  text-black   w-full">
        <div class="flex flex-row  justify-end ml-1 text-black   w-fit">€</div>
        <div class="flex flex-row  justify-end ml-1 text-black   w-fit">-</div>
        <div class="flex flex-row  justify-end ml-1 text-black   w-fit">
          {`${a.precio}`}
        </div>
      </div>
    </div>
  );
};
