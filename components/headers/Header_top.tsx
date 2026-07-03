import { FunctionalComponent } from "preact";
import { User } from "../../types.ts";
import { Logout } from "../../islands/buttons/Logout.tsx";

export const Header_top: FunctionalComponent<{ state: Partial<User> }> = (
  { state },
) => {
  return (
    <div class="flex min-w-screen h-16 bg-gray-800 text-white items-center justify-between px-4">
      <div class=" w-3/4 flex items-center gap-4">
        <img
          src={`/${state.Nombre?.toLowerCase()}.png`}
          class=" rounded-full size-10"
          alt=""
        />
        <p>{state.Nombre}</p>
      </div>
      <form class="formm" action="/login">
        <Logout></Logout>
      </form>
    </div>
  );
};
