import mysql from "npm:mysql2@^3.11.3/promise";
import type { Pool } from "npm:mysql2@^3.11.3/promise";

let pool: Pool | undefined;

function requiredEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value || value.trim() === "") {
    throw new Error(`Variable de entorno obligatoria no definida: ${name}`);
  }
  return value;
}

function numberEnv(name: string, defaultValue: number): number {
  const value = Deno.env.get(name);
  if (!value) return defaultValue;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`La variable de entorno ${name} debe ser numérica`);
  }
  return parsed;
}

export function createConnection(): Pool {
  if (pool) return pool;

  pool = mysql.createPool({
    host: requiredEnv("DB_HOST"),
    port: numberEnv("DB_PORT", 3306),
    user: requiredEnv("DB_USER"),
    password: requiredEnv("DB_PASSWORD"),
    database: requiredEnv("DB_NAME"),
    waitForConnections: true,
    connectionLimit: numberEnv("DB_CONNECTION_LIMIT", 10),
    queueLimit: numberEnv("DB_QUEUE_LIMIT", 0),
    enableKeepAlive: true,
    namedPlaceholders: false,
  });

  return pool;
}

export async function auditLog(
  usuario: string | undefined,
  descripcion: string,
): Promise<void> {
  try {
    await createConnection().execute(
      "INSERT INTO general_log (descripcion) VALUES (?)",
      [`Usuario: ${usuario ?? "sistema"}. ${descripcion}`],
    );
  } catch (error) {
    console.error("No se pudo registrar auditoría:", error);
  }
}

export function db(): Pool {
  return createConnection();
}
