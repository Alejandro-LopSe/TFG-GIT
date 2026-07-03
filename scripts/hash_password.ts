import bcrypt from "bcryptjs";

const password = Deno.args[0] ?? prompt("Contraseña a cifrar:");
if (!password) {
  console.error("Debes informar una contraseña");
  Deno.exit(1);
}

const saltRounds = Number(Deno.env.get("BCRYPT_SALT_ROUNDS") ?? "12");
const hash = await bcrypt.hash(password, saltRounds);
console.log(hash);
