import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { loadPageCopy } from "@/lib/page-content"
import { ProjectsPageView } from "./projects-view"

export default async function ProjectsPage() {
  const pageCopy = await loadPageCopy("projects-page")
  return (
    <>
      <Header />
      <ProjectsPageView pageCopy={pageCopy} />
      <Footer />
    </>
  )
}
