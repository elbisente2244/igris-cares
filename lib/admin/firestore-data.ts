import {
  COLLECTIONS,
  getAllDocuments,
  getDocumentById,
  deleteDocument,
  orderBy,
  setDocument,
  Timestamp,
} from "@/lib/firebase"
import { projects, type Project } from "@/lib/data/projects"
import { events, type Event } from "@/lib/data/events"
import { galleryImages, type GalleryImage } from "@/lib/data/gallery"
import { partners as seedPartners, sponsors as seedSponsors, type Partner, type Sponsor } from "@/lib/data/partners"
import { toPublicEventStatus } from "@/lib/data/status"

type ProjectDoc = Project & { id: string }
type EventDoc = Event & { id: string }
type GalleryDoc = GalleryImage & { id: string }

export async function ensureProjectsSeeded() {
  const existing = await getAllDocuments<ProjectDoc>(COLLECTIONS.PROJECTS, [orderBy("created_at", "desc")])
  if (existing.length > 0) return existing

  await Promise.all(projects.map((project) => setDocument(COLLECTIONS.PROJECTS, project.id, { ...project, created_at: Timestamp.now() })))
  return getAllDocuments<ProjectDoc>(COLLECTIONS.PROJECTS, [orderBy("created_at", "desc")])
}

export async function ensureEventsSeeded() {
  let existing = await getAllDocuments<EventDoc>(COLLECTIONS.EVENTS)
  if (existing.length > 0) return existing

  await Promise.all(
    events.map((event) =>
      setDocument(COLLECTIONS.EVENTS, event.id, {
        ...event,
        event_date: event.date,
        created_at: Timestamp.now(),
      }),
    ),
  )
  return getAllDocuments<EventDoc>(COLLECTIONS.EVENTS)
}

export async function ensureGallerySeeded() {
  const existing = await getAllDocuments<GalleryDoc>(COLLECTIONS.GLOBAL_GALLERY, [orderBy("uploaded_at", "desc")])
  if (existing.length > 0) return existing

  await Promise.all(galleryImages.map((image) => setDocument(COLLECTIONS.GLOBAL_GALLERY, image.id, { ...image, uploaded_at: Timestamp.now() })))
  return getAllDocuments<GalleryDoc>(COLLECTIONS.GLOBAL_GALLERY, [orderBy("uploaded_at", "desc")])
}

export async function getProjectById(id: string) {
  const fromFirestore = await getDocumentById<ProjectDoc>(COLLECTIONS.PROJECTS, id)
  if (fromFirestore) return fromFirestore
  return projects.find((project) => project.id === id) ?? null
}

export async function getEventById(id: string) {
  const fromFirestore = await getDocumentById<EventDoc>(COLLECTIONS.EVENTS, id)
  if (fromFirestore) return fromFirestore
  return events.find((event) => event.id === id) ?? null
}

export async function saveProject(project: ProjectDoc) {
  await setDocument(COLLECTIONS.PROJECTS, project.id, {
    ...project,
    created_at: project.created_at ?? Timestamp.now(),
    updated_at: Timestamp.now(),
  })
}

export async function saveEvent(event: EventDoc) {
  const status = toPublicEventStatus(event.status)
  const date =
    event.date ??
    serializeEventDate((event as EventDoc & { event_date?: unknown }).event_date)

  await setDocument(COLLECTIONS.EVENTS, event.id, {
    ...event,
    status,
    name: event.name ?? (event as EventDoc & { title?: string }).title ?? "",
    date,
    event_date: date,
    image:
      event.image ??
      (Array.isArray(event.photos) && typeof event.photos[0] === "string" ? event.photos[0] : ""),
    created_at: event.created_at ?? Timestamp.now(),
    updated_at: Timestamp.now(),
  })
}

function serializeEventDate(value: unknown): string {
  if (!value) return ""
  if (typeof value === "string") return value
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (typeof value === "object" && value !== null && "toDate" in value) {
    return (value as { toDate: () => Date }).toDate().toISOString().slice(0, 10)
  }
  return String(value)
}

export async function deleteProject(id: string) {
  await deleteDocument(COLLECTIONS.PROJECTS, id)
}

export async function deleteEvent(id: string) {
  await deleteDocument(COLLECTIONS.EVENTS, id)
}

export async function saveGalleryImage(image: GalleryDoc) {
  await setDocument(COLLECTIONS.GLOBAL_GALLERY, image.id, {
    ...image,
    uploaded_at: image.uploaded_at ?? Timestamp.now(),
  })
}

export async function deleteGalleryImage(id: string) {
  await deleteDocument(COLLECTIONS.GLOBAL_GALLERY, id)
}

type PartnerDoc = Partner & { id: string }
type SponsorDoc = Sponsor & { id: string }

export type InquiryRecord = {
  id: string
  name: string
  email: string
  phone?: string
  inquiryType: string
  subject: string
  message: string
  status: "unread" | "read" | "replied" | "archived"
  createdAt: string
}

export async function ensurePartnersSeeded() {
  const existing = await getAllDocuments<PartnerDoc>(COLLECTIONS.PARTNERS, [orderBy("name", "asc")])
  if (existing.length > 0) return existing

  await Promise.all(
    seedPartners.map((partner) =>
      setDocument(COLLECTIONS.PARTNERS, partner.id, { ...partner, created_at: Timestamp.now() }),
    ),
  )
  return getAllDocuments<PartnerDoc>(COLLECTIONS.PARTNERS, [orderBy("name", "asc")])
}

export async function ensureSponsorsSeeded() {
  const existing = await getAllDocuments<SponsorDoc>(COLLECTIONS.SPONSORS, [orderBy("name", "asc")])
  if (existing.length > 0) return existing

  await Promise.all(
    seedSponsors.map((sponsor) =>
      setDocument(COLLECTIONS.SPONSORS, sponsor.id, { ...sponsor, created_at: Timestamp.now() }),
    ),
  )
  return getAllDocuments<SponsorDoc>(COLLECTIONS.SPONSORS, [orderBy("name", "asc")])
}

export async function getPartnerById(id: string) {
  const fromFirestore = await getDocumentById<PartnerDoc>(COLLECTIONS.PARTNERS, id)
  if (fromFirestore) return fromFirestore
  return seedPartners.find((p) => p.id === id) ?? null
}

export async function getSponsorById(id: string) {
  const fromFirestore = await getDocumentById<SponsorDoc>(COLLECTIONS.SPONSORS, id)
  if (fromFirestore) return fromFirestore
  return seedSponsors.find((s) => s.id === id) ?? null
}

export async function savePartner(partner: PartnerDoc) {
  await setDocument(COLLECTIONS.PARTNERS, partner.id, {
    ...partner,
    created_at: (partner as PartnerDoc & { created_at?: unknown }).created_at ?? Timestamp.now(),
    updated_at: Timestamp.now(),
  })
}

export async function saveSponsor(sponsor: SponsorDoc) {
  await setDocument(COLLECTIONS.SPONSORS, sponsor.id, {
    ...sponsor,
    created_at: (sponsor as SponsorDoc & { created_at?: unknown }).created_at ?? Timestamp.now(),
    updated_at: Timestamp.now(),
  })
}

export async function deletePartner(id: string) {
  await deleteDocument(COLLECTIONS.PARTNERS, id)
}

export async function deleteSponsor(id: string) {
  await deleteDocument(COLLECTIONS.SPONSORS, id)
}

export async function saveInquiry(inquiry: Omit<InquiryRecord, "id"> & { id?: string }) {
  const id = inquiry.id ?? crypto.randomUUID()
  await setDocument(COLLECTIONS.CONTACTS, id, {
    sender_name: inquiry.name,
    sender_email: inquiry.email,
    phone: inquiry.phone ?? null,
    inquiry_type: inquiry.inquiryType,
    subject: inquiry.subject,
    message: inquiry.message,
    status: inquiry.status,
    sent_at: Timestamp.now(),
    name: inquiry.name,
    email: inquiry.email,
    inquiryType: inquiry.inquiryType,
    createdAt: inquiry.createdAt ?? new Date().toISOString(),
  })
  return id
}

function normalizeInquiry(doc: Record<string, unknown> & { id: string }): InquiryRecord {
  const created =
    doc.createdAt ??
    (doc.sent_at && typeof doc.sent_at === "object" && "toDate" in (doc.sent_at as object)
      ? (doc.sent_at as { toDate: () => Date }).toDate().toISOString()
      : doc.sent_at
        ? String(doc.sent_at)
        : new Date().toISOString())

  return {
    id: doc.id,
    name: String(doc.name ?? doc.sender_name ?? ""),
    email: String(doc.email ?? doc.sender_email ?? ""),
    phone: doc.phone ? String(doc.phone) : undefined,
    inquiryType: String(doc.inquiryType ?? doc.inquiry_type ?? "general"),
    subject: String(doc.subject ?? ""),
    message: String(doc.message ?? ""),
    status: (doc.status as InquiryRecord["status"]) ?? "unread",
    createdAt: String(created),
  }
}

export async function getAllInquiries() {
  try {
    const docs = await getAllDocuments<Record<string, unknown> & { id: string }>(COLLECTIONS.CONTACTS, [
      orderBy("sent_at", "desc"),
    ])
    return docs.map(normalizeInquiry)
  } catch {
    const docs = await getAllDocuments<Record<string, unknown> & { id: string }>(COLLECTIONS.CONTACTS)
    return docs.map(normalizeInquiry).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }
}

export async function updateInquiry(id: string, data: Partial<Pick<InquiryRecord, "status">>) {
  await setDocument(COLLECTIONS.CONTACTS, id, data as Record<string, unknown>)
}

export async function deleteInquiry(id: string) {
  await deleteDocument(COLLECTIONS.CONTACTS, id)
}

export type DashboardSummary = {
  projectCount: number
  upcomingEventCount: number
  partnerCount: number
  sponsorCount: number
  unreadInquiryCount: number
  recentActivity: Array<{
    id: string
    type: "project" | "event" | "partner" | "inquiry"
    title: string
    time: string
  }>
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return "Just now"
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`
  return new Date(iso).toLocaleDateString()
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const [projectDocs, eventDocs, partnerDocs, sponsorDocs, inquiries] = await Promise.all([
    ensureProjectsSeeded(),
    ensureEventsSeeded(),
    ensurePartnersSeeded(),
    ensureSponsorsSeeded(),
    getAllInquiries(),
  ])

  const upcomingEventCount = eventDocs.filter((e) => toPublicEventStatus(e.status) === "upcoming").length

  const recentActivity: DashboardSummary["recentActivity"] = []

  projectDocs.slice(0, 2).forEach((p) => {
    recentActivity.push({
      id: `project-${p.id}`,
      type: "project",
      title: `${p.title} in projects`,
      time: relativeTime(String((p as ProjectDoc & { updated_at?: { toDate?: () => Date } }).updated_at?.toDate?.() ?? new Date())),
    })
  })

  eventDocs.slice(0, 2).forEach((e) => {
    recentActivity.push({
      id: `event-${e.id}`,
      type: "event",
      title: `${e.name ?? e.title ?? "Event"} on events`,
      time: relativeTime(String(e.date ?? new Date())),
    })
  })

  inquiries.slice(0, 2).forEach((i) => {
    recentActivity.push({
      id: `inquiry-${i.id}`,
      type: "inquiry",
      title: `Inquiry: ${i.subject}`,
      time: relativeTime(i.createdAt),
    })
  })

  return {
    projectCount: projectDocs.length,
    upcomingEventCount,
    partnerCount: partnerDocs.length + sponsorDocs.length,
    sponsorCount: sponsorDocs.length,
    unreadInquiryCount: inquiries.filter((i) => i.status === "unread").length,
    recentActivity: recentActivity.slice(0, 5),
  }
}
