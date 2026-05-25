import { readContentBySlugOptional } from "@/lib/content"
import { FooterUI, type FooterCopy } from "@/components/footer-ui"

export async function Footer() {
  const block = await readContentBySlugOptional("footer")
  const copy = (block?.frontmatter ?? {}) as FooterCopy
  return <FooterUI copy={copy} />
}

export { FooterUI, defaultFooterCopy } from "@/components/footer-ui"
