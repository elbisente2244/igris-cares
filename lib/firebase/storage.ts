import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage"
import { storage } from "./config"

export async function uploadFile(
  path: string,
  file: File
): Promise<string> {
  const storageRef = ref(storage, path)
  const snapshot = await uploadBytes(storageRef, file)
  const downloadURL = await getDownloadURL(snapshot.ref)
  return downloadURL
}

export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(storage, path)
  await deleteObject(storageRef)
}

export async function getFileURL(path: string): Promise<string> {
  const storageRef = ref(storage, path)
  return await getDownloadURL(storageRef)
}

export async function listFiles(path: string): Promise<string[]> {
  const storageRef = ref(storage, path)
  const result = await listAll(storageRef)
  const urls = await Promise.all(
    result.items.map((item) => getDownloadURL(item))
  )
  return urls
}

export { storage }
