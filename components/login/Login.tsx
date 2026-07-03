import { FunctionalComponent } from "preact";

export const Login: FunctionalComponent = () => {
  return (
    <div class="flex w-fit h-fit space-x-2 space-y-2  justify-self-center  flex-col items-center justify-center  bg-gray-400  border-2 border-gray-500 rounded-b-xl shadow-lg">
      <p>BIENVENIDO</p>
      <form
        action="/login"
        method="post"
        class="flex flex-col  space-2 w-10/12 h-2/3 p-2 justify-center items-start"
      >
        <label for="usuario">Usuario</label>
        <select
          name="usuario"
          id="usuario"
          class="flex m-2 bg-slate-200 border-gray-500 rounded-md p-x-2  shadow-lg"
        >
          <option value="Admin">Admin</option>
          <option value="Espe">Espe</option>
          <option value="Angel">Angel</option>
          <option value="Jose">Jose</option>
        </select>
        <label for="contrasena">Contraseña</label>
        <input
          type="password"
          name="contrasena"
          id="contrasena"
          class="w-10/12 h-2/3 flex m-2 bg-slate-200 border-gray-500 rounded-md p-x-2  shadow-lg"
        />
        <button
          type="submit"
          class="flex self-center bg-gray-800 text-slate-300 border-2 border-gray-500 rounded-md px-2 py-0  shadow-lg"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};
