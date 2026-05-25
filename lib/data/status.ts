/** Public site uses upcoming | past | ongoing for events */
export type PublicEventStatus = "upcoming" | "past" | "ongoing"

export function toPublicEventStatus(status?: string): PublicEventStatus {
  if (status === "completed" || status === "past") return "past"
  if (status === "ongoing") return "ongoing"
  return "upcoming"
}

export function toAdminEventStatus(status?: string): PublicEventStatus {
  return toPublicEventStatus(status)
}
