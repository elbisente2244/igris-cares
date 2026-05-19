"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { ArrowRight, Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

const featuredProjects = [
  {
    id: "1",
    title: "Clean Water Initiative",
    description:
      "Providing sustainable access to clean drinking water for rural communities through well construction and water purification systems.",
    image: "https://images.unsplash.com/photo-1541544741670-15e9fc8e9f7a?q=80&w=2070&auto=format&fit=crop",
    location: "Northern Region",
    date: "Ongoing",
    impact: "15,000+ beneficiaries",
    category: "Health & Sanitation",
  },
  {
    id: "2",
    title: "Education for All",
    description:
      "Building schools and providing educational resources to underserved children, ensuring every child has access to quality education.",
    image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?q=80&w=2013&auto=format&fit=crop",
    location: "Central District",
    date: "Since 2020",
    impact: "5,000+ students",
    category: "Education",
  },
  {
    id: "3",
    title: "Women Empowerment Program",
    description:
      "Empowering women through vocational training, microfinance opportunities, and entrepreneurship development programs.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2070&auto=format&fit=crop",
    location: "Multiple Regions",
    date: "Since 2019",
    impact: "2,500+ women trained",
    category: "Economic Development",
  },
]

export function FeaturedProjects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

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
              Our Work
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight text-balance">
              Featured Projects
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl text-pretty">
              Discover how we&apos;re making a tangible difference in communities through our flagship initiatives.
            </p>
          </div>
          <Button variant="outline" asChild className="self-start sm:self-auto">
            <Link href="/projects">
              View All Projects
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
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
