import type { PageProps } from "$fresh/server.ts";
import { StockHistory } from "../../islands/Stock/StockHistory.tsx";
import type { MyState } from "../../types.ts";

export default function StockMovimientosPage(
  _props: PageProps<unknown, MyState>,
) {
  return (
    <main class="min-h-screen bg-gray-100 p-6">
      <section class="mx-auto max-w-7xl rounded bg-white p-6 shadow">
        <h1 class="mb-2 text-2xl font-bold text-gray-900">
          Histórico de movimientos de stock
        </h1>
        <p class="mb-6 text-gray-600">
          Consulta auditada de entradas, salidas, reservas, liberaciones y
          ajustes realizados sobre el inventario.
        </p>
        <StockHistory />
      </section>
    </main>
  );
}
