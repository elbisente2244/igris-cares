import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { StatsSection } from "@/components/home/stats-section"
import { MissionSection } from "@/components/home/mission-section"
import { FeaturedProjects } from "@/components/home/featured-projects"
import { GalleryPreview } from "@/components/home/gallery-preview"
import { SponsorsSection } from "@/components/home/sponsors-section"
import { CTASection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <MissionSection />
        <FeaturedProjects />
        <GalleryPreview />
        <SponsorsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
