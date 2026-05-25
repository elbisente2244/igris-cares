export type PageCopy = Record<string, string | number | boolean | string[]>

export function str(copy: PageCopy, key: string, fallback: string) {
  const v = copy[key]
  return typeof v === "string" && v.length > 0 ? v : fallback
}
