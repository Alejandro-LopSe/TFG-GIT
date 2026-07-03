import { FunctionalComponent } from "preact";
import { BBDD_Cliente } from "../../types.ts";
import { Parse_Date_to_Visual } from "../../Func.ts";

export const Cliente: FunctionalComponent<{ c: BBDD_Cliente }> = (
  { c },
) => {
  return (
    <a
      class="flex flex-row justify-evenly w-full p-2 
       text-black border-gray-800 border-solid rounded-md border-2"
      id={`cliente-${c.id_cliente}`}
      href={`/Clientes/${c.id_cliente}`}
    >
      <div class="flex flex-row justify-start pl-5 text-black  border-gray-700 w-3/12">
        {c.Nombre}
      </div>
      <div class="flex flex-row  justify-start text-black  border-gray-700 w-3/12">
        {c.Apellidos}
      </div>
      <div class="flex flex-row  justify-start  text-black  border-gray-700 w-2/12">
        {c.DNI}
      </div>
      <div class="flex flex-row justify-start text-black  border-gray-700 w-3/12">
        {Parse_Date_to_Visual(c.Fecha_mod)}
      </div>
    </a>
  );
};
