"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, Filter, MapPin, Calendar, ArrowRight } from "lucide-react"
import { PageHero } from "@/components/page-hero"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { projects, categories, type Project } from "@/lib/data/projects"
import { loadPublicProjects } from "@/lib/public-data"
import type { PageCopy } from "@/lib/page-copy"
import { str } from "@/lib/page-copy"

export function ProjectsPageView({ pageCopy }: { pageCopy: PageCopy }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [projectList, setProjectList] = useState<Project[]>(projects)

  useEffect(() => {
    let active = true
    ;(async () => {
      const nextProjects = await loadPublicProjects()
      if (active) setProjectList(nextProjects)
    })()
    return () => {
      active = false
    }
  }, [])

  const filteredProjects = useMemo(() => {
    return projectList.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory =
        selectedCategory === "All" || project.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [projectList, searchQuery, selectedCategory])

  return (
    <main className="pt-16">
      <PageHero
        kicker={str(pageCopy, "kicker", "Our Initiatives")}
        title={str(pageCopy, "title", "Projects Making a Difference")}
        description={str(
          pageCopy,
          "description",
          "Explore our portfolio of community-focused initiatives designed to create sustainable change and improve lives across regions.",
        )}
      />

      <section className="py-8 border-b border-border bg-background sticky top-16 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No projects found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("All")
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-8">
                Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""}
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project, index) => (
                  <motion.article
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group"
                  >
                    <Link href={`/projects/${project.id}`} className="block">
                      <div className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300">
                        <div className="aspect-[4/3] overflow-hidden bg-secondary">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.currentTarget.style.display = "none"
                            }}
                          />
                        </div>
                        <div className="p-6">
                          <span className="inline-block px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full mb-4">
                            {project.category}
                          </span>
                          <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.description}</p>
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
                          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                            <span className="text-sm font-medium text-primary">{project.impact}</span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
