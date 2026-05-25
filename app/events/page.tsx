import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { loadPageCopy } from "@/lib/page-content"
import { EventsPageView } from "./events-view"

export default async function EventsPage() {
  const pageCopy = await loadPageCopy("events-page")
  return (
    <>
      <Header />
      <EventsPageView pageCopy={pageCopy} />
      <Footer />
    </>
  )
}
