import fs from "fs/promises"
import path from "path"

const CONTENT_DIR = path.join(process.cwd(), "content")

type Frontmatter = Record<string, any>

function parseFrontmatter(raw: string): { frontmatter: Frontmatter; content: string } {
  if (!raw.startsWith("---")) return { frontmatter: {}, content: raw }
  const end = raw.indexOf("---", 3)
  if (end === -1) return { frontmatter: {}, content: raw }
  const fmRaw = raw.slice(3, end).trim()
  const content = raw.slice(end + 3).trim()
  const frontmatter: Frontmatter = {}
  for (const line of fmRaw.split(/\r?\n/)) {
    const idx = line.indexOf(":")
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let value: any = line.slice(idx + 1).trim()
    if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    // rudimentary array parsing: [a, b]
    if (value.startsWith("[") && value.endsWith("]")) {
      try {
        value = JSON.parse(value.replace(/'/g, '"'))
      } catch (e) {
        value = value.slice(1, -1).split(",").map((s) => s.trim())
      }
    }
    frontmatter[key] = value
  }
  return { frontmatter, content }
}

export async function listContentFiles() {
  try {
    const entries = await fs.readdir(CONTENT_DIR)
    return entries
  } catch (e) {
    return []
  }
}

export async function readContent(name: string) {
  const filePath = path.join(CONTENT_DIR, name)
  const raw = await fs.readFile(filePath, "utf8")
  return parseFrontmatter(raw)
}

export async function readContentBySlug(slug: string) {
  const candidates = await listContentFiles()
  const name = candidates.find((n) => n.startsWith(slug))
  if (!name) throw new Error("Not found")
  return readContent(name)
}

export default {} as const
