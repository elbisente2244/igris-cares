"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { sponsors as seedSponsors, type Sponsor } from "@/lib/data/partners"
import { loadPublicSponsors } from "@/lib/public-data"

export function SponsorsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [sponsorList, setSponsorList] = useState<Sponsor[]>(seedSponsors)

  useEffect(() => {
    let active = true
    ;(async () => {
      const next = await loadPublicSponsors()
      if (active) setSponsorList(next)
    })()
    return () => {
      active = false
    }
  }, [])

  return (
    <section className="py-20 bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Our Partners
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Trusted by Leading Organizations
          </h2>
        </motion.div>

        <div className="relative overflow-hidden">
          <div className="flex gap-8 animate-marquee">
            {[...sponsorList, ...sponsorList].map((sponsor, index) => (
              <div
                key={`${sponsor.id}-${index}`}
                className="flex-shrink-0 flex items-center justify-center h-16 px-8 bg-card rounded-lg border border-border"
              >
                <span className="text-lg font-semibold text-muted-foreground whitespace-nowrap">
                  {sponsor.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
