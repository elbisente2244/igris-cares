import "server-only"
import fs from "fs/promises"
import path from "path"

const CONTENT_DIR = path.join(process.cwd(), "content")

export type ContentBlock = {
  frontmatter: Record<string, string | number | boolean | string[]>
  content: string
}

function parseScalar(value: string): string | number | boolean | string[] {
  const trimmed = value.trim()
  if ((trimmed.startsWith("\"") && trimmed.endsWith("\"")) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1)
  }
  if (trimmed === "true") return true
  if (trimmed === "false") return false
  if (/^\d+$/.test(trimmed)) return Number.parseInt(trimmed, 10)
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      return JSON.parse(trimmed.replace(/'/g, "\""))
    } catch {
      return trimmed
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^['"]|['"]$/g, ""))
        .filter(Boolean)
    }
  }
  return trimmed
}

function parseFrontmatter(raw: string): ContentBlock {
  if (!raw.startsWith("---")) return { frontmatter: {}, content: raw }
  const end = raw.indexOf("---", 3)
  if (end === -1) return { frontmatter: {}, content: raw }
  const fmRaw = raw.slice(3, end).trim()
  const content = raw.slice(end + 3).trim()
  const frontmatter: ContentBlock["frontmatter"] = {}

  for (const line of fmRaw.split(/\r?\n/)) {
    const idx = line.indexOf(":")
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    const value = line.slice(idx + 1).trim()
    frontmatter[key] = parseScalar(value)
  }

  return { frontmatter, content }
}

export async function listContentFiles() {
  try {
    const entries = await fs.readdir(CONTENT_DIR, { withFileTypes: true })
    return entries.filter((e) => e.isFile() && e.name.endsWith(".md")).map((e) => e.name)
  } catch {
    return []
  }
}

export async function readContent(name: string): Promise<ContentBlock> {
  const filePath = path.join(CONTENT_DIR, name)
  const raw = await fs.readFile(filePath, "utf8")
  return parseFrontmatter(raw)
}

export async function readContentBySlug(slug: string): Promise<ContentBlock> {
  const block = await readContentBySlugOptional(slug)
  if (!block) throw new Error(`Content not found: ${slug}`)
  return block
}

/** Matches `hero.md`, `projects-page.md`, etc. by filename prefix before extension */
export async function readContentBySlugOptional(slug: string): Promise<ContentBlock | null> {
  const candidates = await listContentFiles()
  const name = candidates.find((n) => n.replace(/\.md$/, "") === slug || n.startsWith(`${slug}-`) || n.startsWith(slug))
  if (!name) return null
  return readContent(name)
}

export async function readHomePageContent() {
  const slugs = ["hero", "stats", "mission", "featured-projects", "gallery-preview", "sponsors", "cta"] as const
  const entries = await Promise.all(
    slugs.map(async (slug) => [slug, await readContentBySlugOptional(slug)] as const),
  )
  return Object.fromEntries(entries) as Record<(typeof slugs)[number], ContentBlock | null>
}

export default {} as const
