import {
  COLLECTIONS,
  getAllDocuments,
  getDocumentById,
  addDocument,
  updateDocument,
  deleteDocument,
  orderBy,
} from "@/lib/firebase"

// Types matching the database schema
export interface Project {
  id: string
  title: string
  description: string
  video_links: string[]
  partners_refs: string[]
  sponsors_refs: string[]
  created_at: Date
  image?: string
  location?: string
  impact?: string
  category?: string
  status?: "active" | "completed" | "planned"
}

export interface Event {
  id: string
  project_id: string
  event_name: string
  event_location: string
  event_date: Date
  partners_refs: string[]
  sponsors_refs: string[]
  photos: string[]
  description?: string
  time?: string
  status?: "upcoming" | "past"
  attendees?: number
}

export interface Partner {
  id: string
  name: string
  logo_url: string | null
  contact_person: string
  description?: string
  website?: string
  projects_supported?: string[]
}

export interface Sponsor {
  id: string
  name: string
  logo_url: string | null
  sponsorship_level: "platinum" | "gold" | "silver" | "bronze"
  description?: string
  contribution_areas?: string[]
}

export interface GalleryPhoto {
  id: string
  event_id: string | null
  project_id: string | null
  url: string
  caption?: string
  category?: string
  uploaded_at: Date
}

export interface ContactInquiry {
  id: string
  sender_name: string
  sender_email: string
  phone?: string
  inquiry_type: string
  subject: string
  message: string
  sent_at: Date
  status?: "new" | "read" | "responded"
}

// Projects Service
export const projectsService = {
  getAll: () => getAllDocuments<Project>(COLLECTIONS.PROJECTS, [orderBy("created_at", "desc")]),
  getById: (id: string) => getDocumentById<Project>(COLLECTIONS.PROJECTS, id),
  create: (data: Omit<Project, "id" | "created_at">) => addDocument(COLLECTIONS.PROJECTS, data),
  update: (id: string, data: Partial<Project>) => updateDocument(COLLECTIONS.PROJECTS, id, data),
  delete: (id: string) => deleteDocument(COLLECTIONS.PROJECTS, id),
}

// Events Service
export const eventsService = {
  getAll: () => getAllDocuments<Event>(COLLECTIONS.EVENTS, [orderBy("event_date", "desc")]),
  getById: (id: string) => getDocumentById<Event>(COLLECTIONS.EVENTS, id),
  getByProject: (projectId: string) => 
    getAllDocuments<Event>(COLLECTIONS.EVENTS, [orderBy("event_date", "desc")]),
  create: (data: Omit<Event, "id">) => addDocument(COLLECTIONS.EVENTS, data),
  update: (id: string, data: Partial<Event>) => updateDocument(COLLECTIONS.EVENTS, id, data),
  delete: (id: string) => deleteDocument(COLLECTIONS.EVENTS, id),
}

// Partners Service
export const partnersService = {
  getAll: () => getAllDocuments<Partner>(COLLECTIONS.PARTNERS),
  getById: (id: string) => getDocumentById<Partner>(COLLECTIONS.PARTNERS, id),
  create: (data: Omit<Partner, "id">) => addDocument(COLLECTIONS.PARTNERS, data),
  update: (id: string, data: Partial<Partner>) => updateDocument(COLLECTIONS.PARTNERS, id, data),
  delete: (id: string) => deleteDocument(COLLECTIONS.PARTNERS, id),
}

// Sponsors Service
export const sponsorsService = {
  getAll: () => getAllDocuments<Sponsor>(COLLECTIONS.SPONSORS),
  getById: (id: string) => getDocumentById<Sponsor>(COLLECTIONS.SPONSORS, id),
  create: (data: Omit<Sponsor, "id">) => addDocument(COLLECTIONS.SPONSORS, data),
  update: (id: string, data: Partial<Sponsor>) => updateDocument(COLLECTIONS.SPONSORS, id, data),
  delete: (id: string) => deleteDocument(COLLECTIONS.SPONSORS, id),
}

// Gallery Service
export const galleryService = {
  getAll: () => getAllDocuments<GalleryPhoto>(COLLECTIONS.GLOBAL_GALLERY, [orderBy("uploaded_at", "desc")]),
  getById: (id: string) => getDocumentById<GalleryPhoto>(COLLECTIONS.GLOBAL_GALLERY, id),
  getByEvent: (eventId: string) => 
    getAllDocuments<GalleryPhoto>(COLLECTIONS.GLOBAL_GALLERY, [orderBy("uploaded_at", "desc")]),
  getByProject: (projectId: string) => 
    getAllDocuments<GalleryPhoto>(COLLECTIONS.GLOBAL_GALLERY, [orderBy("uploaded_at", "desc")]),
  create: (data: Omit<GalleryPhoto, "id" | "uploaded_at">) => addDocument(COLLECTIONS.GLOBAL_GALLERY, data),
  update: (id: string, data: Partial<GalleryPhoto>) => updateDocument(COLLECTIONS.GLOBAL_GALLERY, id, data),
  delete: (id: string) => deleteDocument(COLLECTIONS.GLOBAL_GALLERY, id),
}

// Contacts Service
export const contactsService = {
  getAll: () => getAllDocuments<ContactInquiry>(COLLECTIONS.CONTACTS, [orderBy("sent_at", "desc")]),
  getById: (id: string) => getDocumentById<ContactInquiry>(COLLECTIONS.CONTACTS, id),
  create: (data: Omit<ContactInquiry, "id" | "sent_at">) => addDocument(COLLECTIONS.CONTACTS, data),
  update: (id: string, data: Partial<ContactInquiry>) => updateDocument(COLLECTIONS.CONTACTS, id, data),
  delete: (id: string) => deleteDocument(COLLECTIONS.CONTACTS, id),
}
