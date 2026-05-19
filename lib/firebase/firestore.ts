import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  type DocumentData,
  type QueryConstraint,
} from "firebase/firestore"
import { db } from "./config"

// Collection names matching the spec
export const COLLECTIONS = {
  ADMIN_CONFIG: "admin_config",
  PROJECTS: "projects",
  EVENTS: "events",
  PARTNERS: "partners",
  SPONSORS: "sponsors",
  GLOBAL_GALLERY: "global_gallery",
  CONTACTS: "contacts",
} as const

// Generic CRUD operations

export async function getAllDocuments<T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  const collectionRef = collection(db, collectionName)
  const q = query(collectionRef, ...constraints)
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as T[]
}

export async function getDocumentById<T>(
  collectionName: string,
  documentId: string
): Promise<T | null> {
  const docRef = doc(db, collectionName, documentId)
  const snapshot = await getDoc(docRef)
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as T
  }
  return null
}

export async function addDocument<T extends DocumentData>(
  collectionName: string,
  data: T
): Promise<string> {
  const collectionRef = collection(db, collectionName)
  const docRef = await addDoc(collectionRef, {
    ...data,
    created_at: Timestamp.now(),
  })
  return docRef.id
}

export async function updateDocument<T extends Partial<DocumentData>>(
  collectionName: string,
  documentId: string,
  data: T
): Promise<void> {
  const docRef = doc(db, collectionName, documentId)
  await updateDoc(docRef, {
    ...data,
    updated_at: Timestamp.now(),
  })
}

export async function deleteDocument(
  collectionName: string,
  documentId: string
): Promise<void> {
  const docRef = doc(db, collectionName, documentId)
  await deleteDoc(docRef)
}

// Re-export query helpers for convenience
export { query, where, orderBy, limit, Timestamp }
