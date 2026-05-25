import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { StatsSection } from "@/components/home/stats-section"
import { MissionSection } from "@/components/home/mission-section"
import { FeaturedProjects } from "@/components/home/featured-projects"
import { GalleryPreview } from "@/components/home/gallery-preview"
import { SponsorsSection } from "@/components/home/sponsors-section"
import { CTASection } from "@/components/home/cta-section"
import { readContentBySlug } from "@/lib/content"

export default async function HomePage() {
  const hero = await readContentBySlug("hero")
  const mission = await readContentBySlug("mission")

  return (
    <>
      <Header />
      <main>
        <HeroSection frontmatter={hero.frontmatter} content={hero.content} />
        <StatsSection />
        <MissionSection frontmatter={mission.frontmatter} content={mission.content} />
        <FeaturedProjects />
        <GalleryPreview />
        <SponsorsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
