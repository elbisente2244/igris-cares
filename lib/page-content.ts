import "server-only"
import { readContentBySlugOptional } from "@/lib/content"
import type { PageCopy } from "@/lib/page-copy"

export type { PageCopy } from "@/lib/page-copy"

export async function loadPageCopy(slug: string): Promise<PageCopy> {
  const block = await readContentBySlugOptional(slug)
  return (block?.frontmatter ?? {}) as PageCopy
}
