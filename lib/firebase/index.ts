// Firebase services
export { db, auth, storage } from "./config"

// Firestore operations
export {
  COLLECTIONS,
  getAllDocuments,
  getDocumentById,
  addDocument,
  updateDocument,
  deleteDocument,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from "./firestore"

// Auth operations
export {
  signIn,
  signOut,
  onAuthChange,
  getCurrentUser,
} from "./auth"

// Storage operations
export {
  uploadFile,
  deleteFile,
  getFileURL,
  listFiles,
} from "./storage"
