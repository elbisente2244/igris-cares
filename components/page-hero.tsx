"use client"

import { motion } from "framer-motion"

type PageHeroProps = {
  kicker?: string
  title: string
  description?: string
  content?: string
}

export function PageHero({ kicker, title, description, content }: PageHeroProps) {
  return (
    <section className="bg-secondary py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          {kicker && (
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              {kicker}
            </span>
          )}
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-foreground tracking-tight text-balance">
            {title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            {description || content}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
