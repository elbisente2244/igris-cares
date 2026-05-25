import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { loadPageCopy } from "@/lib/page-content"
import { GalleryPageView } from "./gallery-view"

export default async function GalleryPage() {
  const pageCopy = await loadPageCopy("gallery-page")
  return (
    <>
      <Header />
      <GalleryPageView pageCopy={pageCopy} />
      <Footer />
    </>
  )
}
