import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { loadPageCopy } from "@/lib/page-content"
import { ContactPageClient } from "./contact-view"

export default async function ContactPage() {
  const pageCopy = await loadPageCopy("contact-page")
  return (
    <>
      <Header />
      <ContactPageClient pageCopy={pageCopy} />
      <Footer />
    </>
  )
}
