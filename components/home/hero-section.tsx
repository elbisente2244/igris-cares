"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Play, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection({ frontmatter = {}, content = "" }: { frontmatter?: any; content?: string }) {
  return (
    <section className="relative bg-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: copy */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground mb-6 text-sm font-medium">
                <Star className="h-4 w-4 text-primary" strokeWidth={2} />
                {frontmatter.subtitle || "Building with care since 2022"}
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-6">
                {frontmatter.title || (
                  <>Empowering communities, <span className="text-primary">transforming lives</span></>
                )}
              </h1>

              <p className="text-lg text-foreground/75 mb-8">
                {frontmatter.description || content || "Through meaningful outreach programs and sustainable partnerships, we create lasting impact in communities that need it most."}
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Button size="lg" className="h-12 px-6" asChild>
                  <Link
                    href={
                      frontmatter.cta_link ||
                      (typeof frontmatter.cta === "string" && frontmatter.cta.startsWith("/")
                        ? frontmatter.cta
                        : "/projects")
                    }
                  >
                    {frontmatter.cta || "Explore Our Projects"}
                    <ArrowRight className="ml-2 h-4 w-4 inline-block" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-6 text-foreground/80" asChild>
                  <Link
                    href={
                      frontmatter.watch_link ||
                      frontmatter.video_link ||
                      "/gallery"
                    }
                    target={frontmatter.watch_link || frontmatter.video_link ? "_blank" : undefined}
                    rel={frontmatter.watch_link || frontmatter.video_link ? "noopener noreferrer" : undefined}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    {frontmatter.watch_text || "Watch Our Story"}
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Right: illustration */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9 }}
              className="relative w-full h-80 bg-white rounded-lg shadow-lg overflow-hidden flex items-center justify-center"
            >
              {/* Placeholder illustration - replace with branded SVG or image */}
              <img
                src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1600&auto=format&fit=crop"
                alt="community illustration - people working together"
                className="object-cover w-full h-full"
                onError={(e) => { e.currentTarget.style.backgroundColor = '#e6f0fb'; e.currentTarget.style.display = 'none'; }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
