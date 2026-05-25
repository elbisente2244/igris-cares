import { COLLECTIONS, getAllDocuments, getDocumentById, orderBy } from "@/lib/firebase"
import { projects, type Project as SeedProject } from "@/lib/data/projects"
import { events, type Event as SeedEvent } from "@/lib/data/events"
import { galleryImages, type GalleryImage as SeedGalleryImage } from "@/lib/data/gallery"
import {
  partners as seedPartners,
  sponsors as seedSponsors,
  type Partner as SeedPartner,
  type Sponsor as SeedSponsor,
} from "@/lib/data/partners"
import { toPublicEventStatus } from "@/lib/data/status"

export type PublicProject = SeedProject & { fullDescription?: string }
export type PublicEvent = SeedEvent & {
  title?: string
  projectId?: string
  image?: string
  capacity?: string
}
export type PublicGalleryImage = SeedGalleryImage

function normalizeProject(doc: any): PublicProject {
  return {
    id: String(doc.id),
    title: doc.title ?? "",
    description: doc.description ?? "",
    image: doc.image ?? "",
    location: doc.location ?? "",
    date: doc.date ?? "",
    impact: doc.impact ?? "",
    category: doc.category ?? "",
    videoLinks: doc.videoLinks ?? doc.video_links ?? [],
    partners: doc.partners ?? doc.partners_refs ?? [],
    sponsors: doc.sponsors ?? doc.sponsors_refs ?? [],
    status: doc.status === "ongoing" ? "active" : (doc.status ?? "active"),
    fullDescription: doc.fullDescription ?? doc.full_description ?? undefined,
  }
}

function serializeDate(value: unknown): string {
  if (!value) return ""
  if (typeof value === "string") return value
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (typeof value === "object" && value !== null && "toDate" in value) {
    const date = (value as { toDate: () => Date }).toDate()
    return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10)
  }
  return String(value)
}

function isValidEvent(event: PublicEvent): boolean {
  const title = (event.name ?? event.title ?? "").trim()
  return Boolean(event.id && title)
}

function sortEventsByDate(list: PublicEvent[]) {
  return [...list].sort(
    (a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime(),
  )
}

function normalizeEvent(doc: any): PublicEvent {
  const photos = Array.isArray(doc.photos)
    ? doc.photos
    : typeof doc.photos === "string"
      ? [doc.photos]
      : []

  const image =
    doc.image ??
    (typeof photos[0] === "string" ? photos[0] : photos[0]?.url) ??
    ""

  return {
    id: String(doc.id),
    name: doc.name ?? doc.title ?? doc.event_name ?? "",
    title: doc.title ?? doc.name ?? doc.event_name,
    description: doc.description ?? "",
    location: doc.location ?? doc.event_location ?? "",
    date: serializeDate(doc.date ?? doc.event_date),
    time: doc.time ?? "",
    projectId: doc.projectId ?? doc.project_id ?? "",
    image,
    photos,
    partners: doc.partners ?? doc.partners_refs ?? [],
    sponsors: doc.sponsors ?? doc.sponsors_refs ?? [],
    status: toPublicEventStatus(doc.status),
    attendees: typeof doc.attendees === "number" ? doc.attendees : 0,
    capacity: doc.capacity ?? (doc.attendees ? String(doc.attendees) : ""),
  }
}

function normalizeGalleryImage(doc: any): PublicGalleryImage {
  return {
    id: String(doc.id),
    url: doc.url ?? "",
    caption: doc.caption ?? doc.title ?? "",
    eventId: doc.eventId ?? doc.event_id ?? null,
    projectId: doc.projectId ?? doc.project_id ?? null,
    category: doc.category ?? "",
  }
}

export async function loadPublicProjects() {
  try {
    const docs = await getAllDocuments<any>(COLLECTIONS.PROJECTS, [orderBy("created_at", "desc")])
    return docs.length > 0 ? docs.map(normalizeProject) : projects
  } catch {
    return projects
  }
}

export async function loadPublicProjectById(id: string) {
  try {
    const doc = await getDocumentById<any>(COLLECTIONS.PROJECTS, id)
    return doc ? normalizeProject(doc) : projects.find((project) => project.id === id) ?? null
  } catch {
    return projects.find((project) => project.id === id) ?? null
  }
}

export async function loadPublicEvents() {
  try {
    // Do not orderBy event_date — seeded/admin docs use `date`, not `event_date`
    const docs = await getAllDocuments<any>(COLLECTIONS.EVENTS)
    const firestoreEvents = docs.map(normalizeEvent).filter(isValidEvent)
    // Firestore is source of truth when reachable (deletes must not reappear from seed)
    return sortEventsByDate(firestoreEvents)
  } catch {
    return events
  }
}

export async function loadPublicEventById(id: string) {
  try {
    const doc = await getDocumentById<any>(COLLECTIONS.EVENTS, id)
    return doc ? normalizeEvent(doc) : null
  } catch {
    return events.find((event) => event.id === id) ?? null
  }
}

export async function loadPublicGalleryImages() {
  try {
    const docs = await getAllDocuments<any>(COLLECTIONS.GLOBAL_GALLERY, [orderBy("uploaded_at", "desc")])
    return docs.length > 0 ? docs.map(normalizeGalleryImage) : galleryImages
  } catch {
    return galleryImages
  }
}

export type PublicPartner = SeedPartner
export type PublicSponsor = SeedSponsor

export async function loadPublicPartners() {
  try {
    const docs = await getAllDocuments<any>(COLLECTIONS.PARTNERS, [orderBy("name", "asc")])
    return docs.length > 0
      ? docs.map((doc) => ({
          id: String(doc.id),
          name: doc.name ?? "",
          logo: doc.logo ?? doc.logo_url ?? null,
          description: doc.description ?? "",
          contactPerson: doc.contactPerson ?? doc.contact_person ?? "",
          website: doc.website ?? "",
          projectsSupported: doc.projectsSupported ?? doc.projects_supported ?? [],
        }))
      : seedPartners
  } catch {
    return seedPartners
  }
}

export async function loadPublicSponsors() {
  try {
    const docs = await getAllDocuments<any>(COLLECTIONS.SPONSORS, [orderBy("name", "asc")])
    return docs.length > 0
      ? docs.map((doc) => ({
          id: String(doc.id),
          name: doc.name ?? "",
          logo: doc.logo ?? doc.logo_url ?? null,
          tier: doc.tier ?? doc.sponsorship_level ?? "silver",
          description: doc.description ?? "",
          contributionAreas: doc.contributionAreas ?? doc.contribution_areas ?? [],
        }))
      : seedSponsors
  } catch {
    return seedSponsors
  }
}
