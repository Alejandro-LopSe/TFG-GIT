import { useEffect, useMemo, useState } from "preact/hooks";
import type { StockArticulo, StockMovimientoTipo } from "../../types.ts";

type ApiStockResponse = {
  data: StockArticulo[];
};

const tiposMovimiento: Array<{ value: StockMovimientoTipo; label: string }> = [
  { value: "ENTRADA", label: "Entrada" },
  { value: "SALIDA", label: "Salida" },
  { value: "AJUSTE", label: "Ajuste absoluto" },
  { value: "RESERVA", label: "Reserva" },
  { value: "LIBERACION_RESERVA", label: "Liberar reserva" },
];

function estadoLabel(estado: StockArticulo["estado_stock"]): string {
  if (estado === "SIN_STOCK") return "Sin stock";
  if (estado === "BAJO_MINIMO") return "Bajo mínimo";
  return "Correcto";
}

export function StockManager() {
  const [articulos, setArticulos] = useState<StockArticulo[]>([]);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [q, setQ] = useState("");
  const [estado, setEstado] = useState("");
  const [tipo, setTipo] = useState<StockMovimientoTipo>("ENTRADA");
  const [cantidad, setCantidad] = useState("");
  const [motivo, setMotivo] = useState("");
  const [referencia, setReferencia] = useState("");
  const [lote, setLote] = useState("");
  const [fechaCaducidad, setFechaCaducidad] = useState("");
  const [stockMinimo, setStockMinimo] = useState("");
  const [stockMaximo, setStockMaximo] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedArticulo = useMemo(
    () => articulos.find((articulo) => articulo.id_articulo === selectedId),
    [articulos, selectedId],
  );

  async function loadStock() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (estado) params.set("estado", estado);
      const response = await fetch(`/Api/Stock/Stock?${params.toString()}`);
      const payload = await response.json() as ApiStockResponse;
      setArticulos(payload.data ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStock();
  }, []);

  useEffect(() => {
    if (!selectedArticulo) return;
    setStockMinimo(String(selectedArticulo.stock_minimo ?? 0));
    setStockMaximo(
      selectedArticulo.stock_maximo === null
        ? ""
        : String(selectedArticulo.stock_maximo),
    );
    setUbicacion(selectedArticulo.ubicacion ?? "");
  }, [selectedArticulo?.id_articulo]);

  async function registrarMovimiento() {
    if (!selectedId) {
      setMessage("Selecciona un artículo.");
      return;
    }

    const response = await fetch("/Api/Stock/Stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_articulo: selectedId,
        tipo_movimiento: tipo,
        cantidad,
        motivo,
        referencia,
        lote,
        fecha_caducidad: fechaCaducidad,
      }),
    });

    const payload = await response.json();
    if (!response.ok) {
      setMessage(payload.error ?? "No se pudo registrar el movimiento.");
      return;
    }

    setMessage(
      `Movimiento registrado. Stock: ${payload.cantidad_anterior} → ${payload.cantidad_posterior}`,
    );
    setCantidad("");
    setMotivo("");
    setReferencia("");
    setLote("");
    setFechaCaducidad("");
    await loadStock();
  }

  async function guardarConfiguracion() {
    if (!selectedId) {
      setMessage("Selecciona un artículo.");
      return;
    }

    const response = await fetch("/Api/Stock/Stock", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_articulo: selectedId,
        stock_minimo: stockMinimo,
        stock_maximo: stockMaximo,
        ubicacion,
      }),
    });

    const payload = await response.json();
    setMessage(
      response.ok ? "Configuración de stock guardada." : payload.error,
    );
    await loadStock();
  }

  return (
    <div class="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <section>
        <div class="mb-4 grid gap-3 md:grid-cols-[1fr_180px_120px]">
          <input
            class="rounded border px-3 py-2"
            placeholder="Buscar artículo"
            value={q}
            onInput={(event) => setQ(event.currentTarget.value)}
          />
          <select
            class="rounded border px-3 py-2"
            value={estado}
            onChange={(event) => setEstado(event.currentTarget.value)}
          >
            <option value="">Todos</option>
            <option value="OK">Correcto</option>
            <option value="BAJO_MINIMO">Bajo mínimo</option>
            <option value="SIN_STOCK">Sin stock</option>
          </select>
          <button
            class="rounded bg-gray-900 px-4 py-2 text-white"
            onClick={loadStock}
          >
            Buscar
          </button>
        </div>

        <div class="overflow-x-auto rounded border">
          <table class="w-full text-left text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="p-3">Artículo</th>
                <th class="p-3">Stock</th>
                <th class="p-3">Mínimo</th>
                <th class="p-3">Estado</th>
                <th class="p-3">Ubicación</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? (
                  <tr>
                    <td class="p-3" colSpan={5}>Cargando...</td>
                  </tr>
                )
                : articulos.map((articulo) => (
                  <tr
                    key={articulo.id_articulo}
                    class={`cursor-pointer border-t ${
                      selectedId === articulo.id_articulo ? "bg-blue-50" : ""
                    }`}
                    onClick={() => setSelectedId(articulo.id_articulo)}
                  >
                    <td class="p-3">
                      <div class="font-medium">{articulo.nombre}</div>
                      <div class="text-xs text-gray-500">
                        {articulo.tipo_aceite} · {articulo.tamano} ·{" "}
                        {articulo.envase}
                      </div>
                    </td>
                    <td class="p-3">{articulo.cantidad}</td>
                    <td class="p-3">{articulo.stock_minimo}</td>
                    <td class="p-3">{estadoLabel(articulo.estado_stock)}</td>
                    <td class="p-3">{articulo.ubicacion ?? "-"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      <aside class="rounded border p-4">
        <h2 class="mb-3 text-lg font-semibold">Operación de stock</h2>
        <p class="mb-4 text-sm text-gray-600">
          {selectedArticulo
            ? `Artículo seleccionado: ${selectedArticulo.nombre}`
            : "Selecciona un artículo de la tabla."}
        </p>

        <div class="grid gap-3">
          <select
            class="rounded border px-3 py-2"
            value={tipo}
            onChange={(event) =>
              setTipo(event.currentTarget.value as StockMovimientoTipo)}
          >
            {tiposMovimiento.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
          <input
            class="rounded border px-3 py-2"
            placeholder={tipo === "AJUSTE" ? "Nuevo stock total" : "Cantidad"}
            value={cantidad}
            onInput={(event) => setCantidad(event.currentTarget.value)}
          />
          <input
            class="rounded border px-3 py-2"
            placeholder="Motivo obligatorio"
            value={motivo}
            onInput={(event) => setMotivo(event.currentTarget.value)}
          />
          <input
            class="rounded border px-3 py-2"
            placeholder="Referencia/pedido/factura"
            value={referencia}
            onInput={(event) => setReferencia(event.currentTarget.value)}
          />
          <input
            class="rounded border px-3 py-2"
            placeholder="Lote"
            value={lote}
            onInput={(event) => setLote(event.currentTarget.value)}
          />
          <input
            class="rounded border px-3 py-2"
            type="date"
            value={fechaCaducidad}
            onInput={(event) => setFechaCaducidad(event.currentTarget.value)}
          />
          <button
            class="rounded bg-blue-700 px-4 py-2 text-white"
            onClick={registrarMovimiento}
          >
            Registrar movimiento
          </button>
        </div>

        <hr class="my-5" />

        <h2 class="mb-3 text-lg font-semibold">Configuración</h2>
        <div class="grid gap-3">
          <input
            class="rounded border px-3 py-2"
            placeholder="Stock mínimo"
            value={stockMinimo}
            onInput={(event) => setStockMinimo(event.currentTarget.value)}
          />
          <input
            class="rounded border px-3 py-2"
            placeholder="Stock máximo"
            value={stockMaximo}
            onInput={(event) => setStockMaximo(event.currentTarget.value)}
          />
          <input
            class="rounded border px-3 py-2"
            placeholder="Ubicación"
            value={ubicacion}
            onInput={(event) => setUbicacion(event.currentTarget.value)}
          />
          <button
            class="rounded bg-gray-800 px-4 py-2 text-white"
            onClick={guardarConfiguracion}
          >
            Guardar configuración
          </button>
        </div>

        {message && (
          <p class="mt-4 rounded bg-gray-100 p-3 text-sm">{message}</p>
        )}
      </aside>
    </div>
  );
}
