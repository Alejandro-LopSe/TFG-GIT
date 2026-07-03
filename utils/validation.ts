export function asString(value: unknown, fallback = ""): string {
  if (value === null || value === undefined) return fallback;
  return String(value).trim();
}

export function asNullableString(value: unknown): string | null {
  const cleanValue = asString(value);
  return cleanValue === "" || cleanValue.toLowerCase() === "null"
    ? null
    : cleanValue;
}

export function asNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function asPositiveInt(value: unknown, fallback = 0): number {
  const parsed = Math.max(0, Math.floor(asNumber(value, fallback)));
  return parsed;
}

export function validateRequiredFields(
  source: Record<string, unknown>,
  fields: string[],
): string[] {
  return fields.filter((field) => asString(source[field]) === "");
}
