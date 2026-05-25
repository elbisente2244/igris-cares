"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { ArrowRight, Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { projects, type Project } from "@/lib/data/projects"
import { loadPublicProjects } from "@/lib/public-data"

type SectionCopy = {
  kicker?: string
  title?: string
  description?: string
  button_text?: string
  button_link?: string
  limit?: number
}

export function FeaturedProjects({ frontmatter = {} }: { frontmatter?: SectionCopy }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>(projects)

  useEffect(() => {
    let active = true
    ;(async () => {
      const nextProjects = await loadPublicProjects()
      const limit = typeof frontmatter.limit === "number" ? frontmatter.limit : 3
      if (active) setFeaturedProjects(nextProjects.slice(0, limit))
    })()
    return () => {
      active = false
    }
  }, [])

  return (
    <section className="py-24 bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12"
        >
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              {frontmatter.kicker || "Our Work"}
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight text-balance">
              {frontmatter.title || "Featured Projects"}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl text-pretty">
              {frontmatter.description ||
                "Discover how we're making a tangible difference in communities through our flagship initiatives."}
            </p>
          </div>
          <Button variant="outline" asChild className="self-start sm:self-auto">
            <Link href={frontmatter.button_link || "/projects"}>
              {frontmatter.button_text || "View All Projects"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group"
            >
              <Link href={`/projects/${project.id}`} className="block">
                <div className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300">
                  {/* Image */}
                  <div className="aspect-[4/3] overflow-hidden bg-secondary">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full mb-4">
                      {project.category}
                    </span>
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {project.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {project.date}
                      </span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border">
                      <span className="text-sm font-medium text-primary">
                        {project.impact}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
