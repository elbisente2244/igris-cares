export async function sharePage(title: string, url?: string) {
  const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "")

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ title, url: shareUrl })
      return true
    } catch (error) {
      if ((error as Error).name === "AbortError") return false
    }
  }

  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(shareUrl)
    return "copied"
  }

  return false
}

const INQUIRY_TYPE_MAP: Record<string, string> = {
  general: "General Inquiry",
  partnership: "Partnership Opportunity",
  volunteer: "Volunteer Interest",
  donation: "Donation Question",
  media: "Media/Press",
}

export function buildContactUrl(params: Record<string, string>) {
  const search = new URLSearchParams()
  if (params.inquiryType) {
    search.set("inquiryType", INQUIRY_TYPE_MAP[params.inquiryType] ?? params.inquiryType)
  }
  if (params.subject) search.set("subject", params.subject)
  if (params.message) search.set("message", params.message)
  return `/contact?${search.toString()}`
}
