"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { ExternalLink, Users, Building2, Award } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { partners, sponsors, sponsorTiers } from "@/lib/data/partners"

export default function PartnersPage() {
  const partnersRef = useRef(null)
  const sponsorsRef = useRef(null)
  const partnersInView = useInView(partnersRef, { once: true, margin: "-100px" })
  const sponsorsInView = useInView(sponsorsRef, { once: true, margin: "-100px" })

  const platinumSponsors = sponsors.filter((s) => s.tier === "platinum")
  const goldSponsors = sponsors.filter((s) => s.tier === "gold")
  const silverSponsors = sponsors.filter((s) => s.tier === "silver")

  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-secondary py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                Our Network
              </span>
              <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-foreground tracking-tight text-balance">
                Partners & Sponsors
              </h1>
              <p className="mt-4 text-lg text-muted-foreground text-pretty">
                Together with our valued partners and generous sponsors, we create lasting impact. Their support enables us to reach more communities and transform more lives.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-background border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {partners.length}+
                </div>
                <p className="text-sm text-muted-foreground">Implementation Partners</p>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {sponsors.length}+
                </div>
                <p className="text-sm text-muted-foreground">Corporate Sponsors</p>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  50+
                </div>
                <p className="text-sm text-muted-foreground">Joint Projects</p>
              </div>
            </div>
          </div>
        </section>

        {/* Sponsors Section */}
        <section className="py-20 bg-background" ref={sponsorsRef}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={sponsorsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 text-primary mb-4">
                <Award className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Our Sponsors
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Corporate partners who share our vision and provide crucial funding for our initiatives.
              </p>
            </motion.div>

            {/* Platinum Tier */}
            {platinumSponsors.length > 0 && (
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <span className="px-4 py-1 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 text-sm font-semibold">
                    Platinum Partners
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {platinumSponsors.map((sponsor, index) => (
                    <motion.div
                      key={sponsor.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={sponsorsInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`${sponsorTiers.platinum.color} rounded-2xl p-8 border ${sponsorTiers.platinum.borderColor}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-16 w-16 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                          <span className="text-xl font-bold text-gray-600">
                            {sponsor.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground mb-2">
                            {sponsor.name}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-4">
                            {sponsor.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {sponsor.contributionAreas.map((area) => (
                              <span
                                key={area}
                                className="px-2 py-1 bg-white/50 rounded-full text-xs text-muted-foreground"
                              >
                                {area}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Gold Tier */}
            {goldSponsors.length > 0 && (
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <span className="px-4 py-1 rounded-full bg-gradient-to-r from-amber-200 to-amber-300 text-amber-800 text-sm font-semibold">
                    Gold Partners
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {goldSponsors.map((sponsor, index) => (
                    <motion.div
                      key={sponsor.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={sponsorsInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                      className={`${sponsorTiers.gold.color} rounded-xl p-6 border ${sponsorTiers.gold.borderColor}`}
                    >
                      <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center mb-4">
                        <span className="text-lg font-bold text-amber-600">
                          {sponsor.name.charAt(0)}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {sponsor.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {sponsor.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {sponsor.contributionAreas.slice(0, 2).map((area) => (
                          <span
                            key={area}
                            className="px-2 py-0.5 bg-white/50 rounded-full text-xs text-muted-foreground"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Silver Tier */}
            {silverSponsors.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <span className="px-4 py-1 rounded-full bg-gradient-to-r from-slate-200 to-slate-300 text-slate-700 text-sm font-semibold">
                    Silver Partners
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {silverSponsors.map((sponsor, index) => (
                    <motion.div
                      key={sponsor.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={sponsorsInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                      className={`${sponsorTiers.silver.color} rounded-lg p-4 border ${sponsorTiers.silver.borderColor} text-center`}
                    >
                      <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center mx-auto mb-3">
                        <span className="text-sm font-bold text-slate-500">
                          {sponsor.name.charAt(0)}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-foreground">
                        {sponsor.name}
                      </h3>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-20 bg-secondary/50" ref={partnersRef}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={partnersInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 text-primary mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Implementation Partners
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Organizations we collaborate with to design, implement, and scale our programs effectively.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {partners.map((partner, index) => (
                <motion.div
                  key={partner.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={partnersInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {partner.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {partner.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {partner.projectsSupported.slice(0, 2).map((project) => (
                      <span
                        key={project}
                        className="px-2 py-0.5 bg-secondary rounded-full text-xs text-muted-foreground"
                      >
                        {project}
                      </span>
                    ))}
                  </div>
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-primary hover:underline"
                  >
                    Visit Website
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">
              Become a Partner
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Join our network of partners and sponsors to make a meaningful difference. Whether through funding, expertise, or resources, your contribution matters.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                asChild
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
              >
                Download Partnership Guide
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
