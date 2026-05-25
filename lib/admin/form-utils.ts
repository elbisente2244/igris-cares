export function serializeDate(value: unknown): string {
  if (!value) return ""
  if (typeof value === "string") return value
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (typeof value === "object" && value !== null && "toDate" in value) {
    const date = (value as { toDate: () => Date }).toDate()
    return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10)
  }
  return String(value)
}

/** Format for <input type="date" /> (YYYY-MM-DD) */
export function toDateInputValue(value: unknown): string {
  const raw = serializeDate(value)
  if (!raw) return ""
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10)
  const parsed = new Date(raw)
  if (Number.isNaN(parsed.getTime())) return ""
  return parsed.toISOString().slice(0, 10)
}

export function listToText(value?: string[]) {
  return (value ?? []).join("\n")
}

export function textToList(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
}
