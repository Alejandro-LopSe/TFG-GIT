import { FunctionalComponent } from "preact";
import { BBDD_Articulo } from "../../types.ts";
import { useState } from "preact/hooks";
export const SaveArticulo: FunctionalComponent<{
  art: Partial<BBDD_Articulo>;
}> = ({ art }) => {
  const [saved, setsaved] = useState<string>("");
  const save = async () => {
    const body = {
      nombre: `${art.tipo_aceite!.tipo} ${art.tamano!.tipo}L - ${
        art.envase!.tipo
      }`,
      precio: art.precio!,
      cantidad: art.cantidad!,
      tipo_aceite: art.tipo_aceite!.id!,
      envase: art.envase!.id!,
      tamano: art.tamano!.id!,
      Tipo_IVA: art.Tipo_IVA!.id!,
    };

    const res = await fetch(`http://92.191.5.86:10000/Api/Articulo/Articulo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    console.log("body: \n", body);
    const data = await res.json();
    console.log("data: \n", data);

    if (res.ok) {
      console.log("Articulo insertado", res);
      setsaved("¡Guardado! ✅");
    } else {
      console.error("Error al cargar datos:", res.statusText);
      setsaved("¡Error! ❌");
    }
  };
  return (
    <>
      <button
        class="flex flex-row justify-start pt-1 pl-2 border-2 rounded-md border-gray-700 w-fit pr-1"
        onClick={save}
        type="button">
        <img src="save.png" class="w-6 h-6" />
        Añadir Artículo
      </button>
      <div>{saved}</div>
    </>
  );
};
