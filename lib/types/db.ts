import type { Timestamp } from "firebase/firestore";

export interface AdminConfig {
  admin_uid: string;
  email?: string;
  last_login?: Timestamp | Date | null;
}

export interface Project {
  project_id: string;
  title: string;
  description?: string;
  video_links?: string[]; // ['url1', 'url2']
  partners_refs?: string[]; // Array of Partner IDs (FK)
  sponsors_refs?: string[]; // Array of Sponsor IDs (FK)
  created_at?: Timestamp | Date;
}

export interface EventPhoto {
  url: string;
  caption?: string;
  id?: string;
}

export interface Event {
  event_id: string;
  project_id?: string;
  event_name: string;
  event_location?: string;
  event_date?: Timestamp | Date;
  partners_refs?: string[];
  sponsors_refs?: string[];
  photos?: EventPhoto[];
}

export interface Partner {
  partner_id: string;
  name: string;
  logo_url?: string;
  contact_person?: string;
}

export interface Sponsor {
  sponsor_id: string;
  name: string;
  logo_url?: string;
  sponsorship_level?: string;
}

export interface GlobalGalleryItem {
  photo_id: string;
  event_id?: string;
  project_id?: string;
  url: string;
  uploaded_at?: Timestamp | Date;
}

export interface ContactInquiry {
  inquiry_id: string;
  sender_name?: string;
  message?: string;
  sent_at?: Timestamp | Date;
}

export const COLLECTIONS = {
  ADMIN_CONFIG: "admin_config",
  PROJECTS: "projects",
  EVENTS: "events",
  PARTNERS: "partners",
  SPONSORS: "sponsors",
  GLOBAL_GALLERY: "global_gallery",
  CONTACTS: "contacts",
} as const;

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];

export default {};
