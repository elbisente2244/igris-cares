export const ADMIN_STORAGE_KEYS = {
  projects: "igris.admin.projects",
  events: "igris.admin.events",
} as const

export function loadCollection<T>(storageKey: string, fallback: T[]): T[] {
  if (typeof window === "undefined") return fallback

  try {
    const raw = window.localStorage.getItem(storageKey)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

export function saveCollection<T>(storageKey: string, items: T[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(storageKey, JSON.stringify(items))
}

export function upsertById<T extends { id: string }>(items: T[], nextItem: T): T[] {
  const index = items.findIndex((item) => item.id === nextItem.id)
  if (index === -1) return [...items, nextItem]
  const clone = [...items]
  clone[index] = nextItem
  return clone
}

export function findById<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find((item) => item.id === id)
}
