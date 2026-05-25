export type SiteSettings = {
  siteName: string
  tagline: string
  email: string
  phone: string
  address: string
  facebook: string
  twitter: string
  instagram: string
  linkedin: string
  enableDonations: boolean
  enableVolunteerSignup: boolean
  enableNewsletter: boolean
  maintenanceMode: boolean
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: "Igris Cares",
  tagline: "Making a Difference Together",
  email: "contact@igriscares.org",
  phone: "+63 123 456 7890",
  address: "123 Main Street, Manila, Philippines",
  facebook: "https://facebook.com/igriscares",
  twitter: "https://twitter.com/igriscares",
  instagram: "https://instagram.com/igriscares",
  linkedin: "https://linkedin.com/company/igriscares",
  enableDonations: true,
  enableVolunteerSignup: true,
  enableNewsletter: true,
  maintenanceMode: false,
}

const STORAGE_KEY = "igris-site-settings"

export function loadSiteSettings(): SiteSettings {
  if (typeof window === "undefined") return DEFAULT_SITE_SETTINGS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_SITE_SETTINGS
    return { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_SITE_SETTINGS
  }
}

export function saveSiteSettings(settings: SiteSettings) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}
