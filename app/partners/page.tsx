import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { loadPageCopy } from "@/lib/page-content"
import { PartnersPageView } from "./partners-view"

export default async function PartnersPage() {
  const pageCopy = await loadPageCopy("partners-page")
  return (
    <>
      <Header />
      <PartnersPageView pageCopy={pageCopy} />
      <Footer />
    </>
  )
}
