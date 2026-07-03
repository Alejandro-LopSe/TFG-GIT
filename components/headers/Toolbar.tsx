import { FunctionalComponent } from "preact";
import { MyState } from "../../types.ts";
import { Toolbar_Cliente } from "../../islands/Desplegables/Toolbar_Cliente.tsx";
import { Toolbar_Pedidos } from "../../islands/Desplegables/Toolbar_Pedidos.tsx";
import { Toolbar_Articulo } from "../../islands/Desplegables/Toolbar_Articulo.tsx";
import { Toolbar_Otros } from "../../islands/Desplegables/Toolbar_Otros.tsx";

export const Toolbar: FunctionalComponent<{ state: MyState }> = (
  { state },
) => {
  return (
    <div class="flex flex-col w-20 min-h-[calc(100dvh-4rem)]  bg-gray-800 text-white items-start justify-start ">
      <a href="/Portal" class="flex w-full border-b-2 border-gray-700 p-2">
        Home
      </a>
      <Toolbar_Cliente route={state.route} />
      <Toolbar_Pedidos route={state.route} />
      <Toolbar_Articulo route={state.route} />
      <Toolbar_Otros route={state.route} />
    </div>
  );
};
