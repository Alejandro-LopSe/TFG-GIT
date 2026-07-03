import { BBDD_Cliente } from "./types.ts";
import { Signal } from "@preact/signals-core";
export const filtro_clientes = new Signal<Partial<BBDD_Cliente>>({
  Nombre: undefined,
  Apellidos: undefined,
  DNI: undefined,
  Fecha_mod: undefined,
});
export const clientes_filtrados = new Signal<BBDD_Cliente[]>([]);
