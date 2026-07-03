import { FunctionalComponent } from "preact";

export const Logout: FunctionalComponent = () => {
  const logout = () => {
    document.cookie = "auth= ; Max-Age=0,1;";
    globalThis.location.href = "/login";
  };
  return (
    <>
      <button
        type="submit"
        onClick={() => {
          logout();
        }}
      >
        Cerrar Sesion
      </button>
    </>
  );
};
