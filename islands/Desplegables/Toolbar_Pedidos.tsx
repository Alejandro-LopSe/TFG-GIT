import { useState } from "preact/hooks";
import { FunctionalComponent } from "preact";

export const Toolbar_Pedidos: FunctionalComponent<{ route: string }> = (
  { route },
) => {
  const [isHover, hovering] = useState<boolean>(false);

  const [inroute, _set_inroute] = useState<boolean>(
    route == undefined ? false : route.includes("Pedidos"),
  );

  return (
    <div
      class="relative inline-block  border-gray-700 w-full"
      onMouseEnter={() => hovering(true)}
      onMouseLeave={() => hovering(false)}
    >
      <div
        class={inroute
          ? "bg-gray-700 text-white justify-items-start rounded cursor-pointer w-full p-2"
          : "bg-gray-800 text-white justify-items-start rounded cursor-pointer w-full p-2"}
      >
        Pedidos
      </div>

      {isHover && (
        <div class="absolute left-full top-0 ml-0 flex flex-col bg-gray-700 p-2 rounded shadow">
          <div>Ver</div>
          <div>Añadir</div>
        </div>
      )}
    </div>
  );
};
