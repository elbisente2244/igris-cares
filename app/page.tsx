import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { StatsSection } from "@/components/home/stats-section"
import { MissionSection } from "@/components/home/mission-section"
import { FeaturedProjects } from "@/components/home/featured-projects"
import { GalleryPreview } from "@/components/home/gallery-preview"
import { SponsorsSection } from "@/components/home/sponsors-section"
import { CTASection } from "@/components/home/cta-section"
import { readHomePageContent } from "@/lib/content"

function fm(block: { frontmatter: Record<string, unknown> } | null) {
  return (block?.frontmatter ?? {}) as Record<string, unknown>
}

export default async function HomePage() {
  const home = await readHomePageContent()

  return (
    <>
      <Header />
      <main>
        <HeroSection frontmatter={fm(home.hero)} content={home.hero?.content ?? ""} />
        <StatsSection frontmatter={fm(home.stats)} />
        <MissionSection frontmatter={fm(home.mission)} content={home.mission?.content ?? ""} />
        <FeaturedProjects frontmatter={fm(home["featured-projects"]) as never} />
        <GalleryPreview frontmatter={fm(home["gallery-preview"]) as never} />
        <SponsorsSection frontmatter={fm(home.sponsors) as never} />
        <CTASection frontmatter={fm(home.cta) as never} />
      </main>
      <Footer />
    </>
  )
}
