import type { PageProps } from "$fresh/server.ts";
import { StockManager } from "../../islands/Stock/StockManager.tsx";
import type { MyState } from "../../types.ts";

export default function StockPage(props: PageProps<unknown, MyState>) {
  return (
    <main class="min-h-screen bg-gray-100 p-6">
      <section class="mx-auto max-w-7xl rounded bg-white p-6 shadow">
        <div class="mb-6 flex flex-col gap-2">
          <p class="text-sm text-gray-500">Usuario: {props.state.Nombre}</p>
          <h1 class="text-2xl font-bold text-gray-900">
            Gestión avanzada de stock
          </h1>
          <p class="text-gray-600">
            Control de existencias, movimientos de entrada/salida, ajustes,
            reservas, configuración de mínimos y trazabilidad por usuario.
          </p>
        </div>
        <StockManager />
      </section>
    </main>
  );
}
