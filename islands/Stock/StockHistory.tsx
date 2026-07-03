import { useEffect, useState } from "preact/hooks";
import type { StockMovimiento } from "../../types.ts";

type StockMovimientoVista = StockMovimiento & {
  nombre_articulo: string;
};

type ApiResponse = {
  data: StockMovimientoVista[];
};

export function StockHistory() {
  const [rows, setRows] = useState<StockMovimientoVista[]>([]);
  const [idArticulo, setIdArticulo] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadHistory() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (idArticulo) params.set("id_articulo", idArticulo);
      if (desde) params.set("desde", desde);
      if (hasta) params.set("hasta", hasta);
      const response = await fetch(
        `/Api/Stock/Movimientos?${params.toString()}`,
      );
      const payload = await response.json() as ApiResponse;
      setRows(payload.data ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div>
      <div class="mb-4 grid gap-3 md:grid-cols-[160px_160px_160px_120px]">
        <input
          class="rounded border px-3 py-2"
          placeholder="ID artículo"
          value={idArticulo}
          onInput={(event) => setIdArticulo(event.currentTarget.value)}
        />
        <input
          class="rounded border px-3 py-2"
          type="date"
          value={desde}
          onInput={(event) => setDesde(event.currentTarget.value)}
        />
        <input
          class="rounded border px-3 py-2"
          type="date"
          value={hasta}
          onInput={(event) => setHasta(event.currentTarget.value)}
        />
        <button
          class="rounded bg-gray-900 px-4 py-2 text-white"
          onClick={loadHistory}
        >
          Buscar
        </button>
      </div>

      <div class="overflow-x-auto rounded border">
        <table class="w-full text-left text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="p-3">Fecha</th>
              <th class="p-3">Artículo</th>
              <th class="p-3">Tipo</th>
              <th class="p-3">Cantidad</th>
              <th class="p-3">Anterior</th>
              <th class="p-3">Posterior</th>
              <th class="p-3">Motivo</th>
              <th class="p-3">Usuario</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? (
                <tr>
                  <td class="p-3" colSpan={8}>Cargando...</td>
                </tr>
              )
              : rows.map((row) => (
                <tr class="border-t" key={row.id_movimiento}>
                  <td class="p-3">{String(row.fch_creacion)}</td>
                  <td class="p-3">{row.nombre_articulo}</td>
                  <td class="p-3">{row.tipo_movimiento}</td>
                  <td class="p-3">{row.cantidad}</td>
                  <td class="p-3">{row.cantidad_anterior}</td>
                  <td class="p-3">{row.cantidad_posterior}</td>
                  <td class="p-3">{row.motivo}</td>
                  <td class="p-3">{row.usuario_actualizador ?? "-"}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
