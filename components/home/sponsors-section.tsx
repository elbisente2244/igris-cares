"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

const sponsors = [
  { name: "GlobalTech", tier: "platinum" },
  { name: "EcoVentures", tier: "platinum" },
  { name: "HealthFirst", tier: "gold" },
  { name: "EduCorp", tier: "gold" },
  { name: "GreenEnergy", tier: "gold" },
  { name: "CommUnity Bank", tier: "silver" },
  { name: "FoodForAll", tier: "silver" },
  { name: "BuildTogether", tier: "silver" },
]

export function SponsorsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

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

        {/* Sponsor Logos - Animated Carousel */}
        <div className="relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center flex-wrap gap-8 md:gap-12"
          >
            {sponsors.map((sponsor, index) => (
              <motion.div
                key={sponsor.name}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center justify-center h-16 px-8 rounded-lg bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 group"
              >
                <span className="text-lg font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                  {sponsor.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center text-sm text-muted-foreground"
        >
          <p>
            Join <span className="font-semibold text-foreground">50+</span> organizations making a difference with us
          </p>
        </motion.div>
      </div>
    </section>
  )
}
