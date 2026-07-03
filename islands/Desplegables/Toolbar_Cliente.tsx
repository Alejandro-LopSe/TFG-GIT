import { useState } from "preact/hooks";
import { FunctionalComponent } from "preact";

export const Toolbar_Cliente: FunctionalComponent<{ route: string }> = (
  { route },
) => {
  const [isHover, hovering] = useState<boolean>(false);
  const [inroute, _set_inroute] = useState<boolean>(
    route == undefined ? false : route.includes("Clientes"),
  );
  return (
    <div
      class="relative flex justify-start border-gray-700 w-full "
      onMouseEnter={() => hovering(true)}
      onMouseLeave={() => hovering(false)}
    >
      <div
        class={inroute
          ? "bg-gray-700 text-white justify-items-start rounded cursor-pointer w-full p-2"
          : "bg-gray-800 text-white justify-items-start rounded cursor-pointer w-full p-2"}
      >
        Clientes
      </div>

      {isHover && (
        <div class="absolute left-full top-0 ml-0 flex flex-col bg-gray-700 p-2 rounded shadow">
          <a href="/Clientes">Ver</a>
          <a href="/Clientes/Añadir">Añadir</a>
        </div>
      )}
    </div>
  );
};
