import { timeStamp } from "node:console";
import mysql from "npm:mysql2@^2.3.3/promise";

const pools = {
  local: mysql.createConnection({
    host: "127.0.0.1",
    port: 8001,
    user: "Admin",
    password: "-Fabrica-1974",
    database: "fabrica",
    waitForConnections: true,
    connectionLimit: 5000000,
    queueLimit: 0,
  }), /*
  remote: mysql.createConnection({
    host: "188.76.237.70",
    port: 10001,
    user: "Admin",
    password: "-Fabrica-1974",
    database: "fabrica",
    waitForConnections: true,
    connectionLimit: 5000000,
    queueLimit: 0,
  }),*/
};

let dbb: mysql.Connection | undefined = undefined;

export async function createConnection(usuario?: string, contraseña?: string) {
  // Si ya existe una conexión, ciérrala
  if (!dbb) {
    // Crea nueva conexión con el nuevo usuario
    dbb = await pools.remote;
    const date = new Date();
    const timestamp =
      `🔐 Nueva conexión establecida como Usuario: ${usuario},Fecha: ${date.toLocaleDateString()}, Hora: ${date.toLocaleTimeString()}`;

    await dbb.query(
      `insert into general_log (descripcion) values('${timestamp}')`,
    );
    return dbb;
  }

  return dbb;
}
export function db() {
  const d = createConnection();
  return d;
}
