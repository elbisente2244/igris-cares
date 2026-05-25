"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Target, Eye, Sparkles } from "lucide-react"

export function MissionSection({ frontmatter = {}, content = "" }: { frontmatter?: any; content?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const values = frontmatter.values || [
    {
      icon: Target,
      title: "Our Mission",
      description:
        frontmatter.description ||
        "To create sustainable change in underserved communities through collaborative partnerships, innovative programs, and genuine care for every individual we serve.",
    },
    {
      icon: Eye,
      title: "Our Vision",
      description:
        frontmatter.vision ||
        "A world where every community has access to the resources, opportunities, and support they need to thrive and build a brighter future for generations to come.",
    },
    {
      icon: Sparkles,
      title: "Our Values",
      description:
        frontmatter.values_text ||
        "Integrity, compassion, sustainability, and collaboration guide everything we do. We believe in transparency, measurable impact, and empowering local leaders.",
    },
  ]

  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            {frontmatter.kicker || "Who We Are"}
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight text-balance">
            {frontmatter.title || (
              <>Driven by Purpose, <span className="text-primary">Guided by Heart</span></>
            )}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            {frontmatter.description || content || "IGRIS CARES is dedicated to transforming communities through meaningful outreach and sustainable development initiatives."}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value: any, index: number) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative group"
            >
              <div className="bg-card rounded-2xl p-8 h-full border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
