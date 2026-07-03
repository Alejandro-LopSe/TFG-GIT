/**
 * Aplica correcciones de lint sobre ficheros del repositorio original que no forman
 * parte del parche de seguridad. Ejecutar desde la raíz del repositorio:
 *   deno run --allow-read --allow-write scripts/apply_lint_fixes.ts
 */
import { existsSync } from "https://deno.land/std@0.224.0/fs/mod.ts";

function update(path: string, fn: (content: string) => string) {
  if (!existsSync(path)) {
    console.warn(`No encontrado: ${path}`);
    return;
  }
  const original = Deno.readTextFileSync(path);
  const updated = fn(original);
  if (updated !== original) {
    Deno.writeTextFileSync(path, updated);
    console.log(`Actualizado: ${path}`);
  }
}

function removeImport(content: string, pattern: RegExp) {
  return content.replace(pattern, "");
}

function fixJsxLiteralLabels(content: string) {
  return content.replace(/>\{"([^"{}]+)"\}<\/div>/g, ">$1</div>");
}

update("components/Generales/Desplegable.tsx", (s) => {
  s = removeImport(
    s,
    /import\s*\{\s*Articulo\s*\}\s*from\s*["']\.\.\/\.\.\/islands\/Articulos\/Articulo\.tsx["'];\s*/g,
  );
  s = s.replace(
    /=\s*\(\s*\{\s*art\s*,\s*arr\s*\}\s*\)\s*=>/g,
    "= ({ art: _art, arr }) =>",
  );
  return s;
});

update("components/Detalle/Base.tsx", (s) => {
  s = removeImport(
    s,
    /import\s*\{\s*Save\s*\}\s*from\s*["']\.\.\/\.\.\/islands\/buttons\/Save\.tsx["'];\s*/g,
  );
  return fixJsxLiteralLabels(s);
});

update("routes/Clientes/index.tsx", (s) => {
  return removeImport(
    s,
    /import\s*\{\s*Clientes\s*\}\s*from\s*["']\.\.\/\.\.\/islands\/Clientes\/Clientes\.tsx["'];\s*/g,
  );
});

update("routes/Clientes/Añadir.tsx", (s) => {
  s = removeImport(
    s,
    /import\s*\{\s*Base\s*\}\s*from\s*["']\.\.\/\.\.\/components\/Detalle\/Base\.tsx["'];\s*/g,
  );
  s = removeImport(
    s,
    /import\s*\{\s*Contacto\s*\}\s*from\s*["']\.\.\/\.\.\/components\/Detalle\/Contacto\.tsx["'];\s*/g,
  );
  s = removeImport(
    s,
    /import\s*\{\s*Direccion\s*\}\s*from\s*["']\.\.\/\.\.\/components\/Detalle\/Direccion\.tsx["'];\s*/g,
  );
  s = removeImport(
    s,
    /import\s*\{\s*Empresa\s*\}\s*from\s*["']\.\.\/\.\.\/components\/Detalle\/Empresa\.tsx["'];\s*/g,
  );
  s = s.replace(/\bBBDD_Contacto,?\s*/g, "");
  s = s.replace(/\bBBDD_Direccion,?\s*/g, "");
  s = s.replace(/\bBBDD_Empresa,?\s*/g, "");
  s = s.replace(/POST\(\s*req:\s*Request/g, "POST(_req: Request");
  s = s.replace(/function\s+Home\(\s*props:/g, "function Home(_props:");
  return s;
});

update("routes/Articulos/Añadir.tsx", (s) => {
  s = s.replace(/POST\(\s*req:\s*Request/g, "POST(_req: Request");
  s = s.replace(/function\s+Home\(\s*props:/g, "function Home(_props:");
  return s;
});

update("components/Articulos_V2/ArticuloAdd.tsx", (s) => {
  return s.replace(
    /<option\s+value=\{a\.id\}>/g,
    "<option key={a.id} value={a.id}>",
  );
});

for (
  const path of [
    "islands/Detalles/Direccion.tsx",
    "islands/Detalles/Base.tsx",
    "islands/Detalles/Empresa.tsx",
    "islands/Detalles/Contacto.tsx",
  ]
) {
  update(path, fixJsxLiteralLabels);
}

update("islands/Filtros/Filtro_Clientes.tsx", (s) => {
  s = removeImport(
    s,
    /import\s*\{\s*clientes_filtrados\s*,\s*filtro_clientes\s*\}\s*from\s*["']\.\.\/\.\.\/signals\.ts["'];\s*/g,
  );
  s = removeImport(
    s,
    /import\s*\{\s*Clientes\s*\}\s*from\s*["']\.\.\/Clientes\/Clientes\.tsx["'];\s*/g,
  );
  return s;
});
update("islands/Clientes/Anadir_Cliente.tsx", (s) => {
  return s.replace(/:\s*<><\/>/g, ": null");
});

console.log(
  "Correcciones aplicadas. Ejecuta ahora: deno lint --fix && deno fmt && deno task check",
);
