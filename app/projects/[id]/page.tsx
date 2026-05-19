"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, MapPin, Calendar, Users, Play, Share2, Heart } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { projects } from "@/lib/data/projects"

export default function ProjectDetailPage() {
  const params = useParams()
  const project = projects.find((p) => p.id === params.id)

  if (!project) {
    return (
      <>
        <Header />
        <main className="pt-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
            <Button asChild>
              <Link href="/projects">Back to Projects</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Hero Image */}
        <section className="relative h-[50vh] md:h-[60vh]">
          <div className="absolute inset-0">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent" />
          </div>

          {/* Back Button */}
          <div className="absolute top-6 left-6 z-10">
            <Button variant="secondary" size="sm" asChild>
              <Link href="/projects">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Link>
            </Button>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="mx-auto max-w-7xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-3 py-1 text-xs font-medium text-primary-foreground bg-primary rounded-full mb-4">
                  {project.category}
                </span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-background mb-4">
                  {project.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-background/80">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {project.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {project.date}
                  </span>
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {project.impact}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    About This Project
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-8">
                    {project.description}
                  </p>

                  {/* Video Section */}
                  {project.videoLinks && project.videoLinks.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-foreground mb-4">
                        Watch Our Impact
                      </h3>
                      <div className="aspect-video bg-secondary rounded-xl flex items-center justify-center border border-border">
                        <Button variant="outline" size="lg">
                          <Play className="mr-2 h-5 w-5" />
                          Play Video
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Impact Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-secondary rounded-xl p-6 text-center">
                      <div className="text-2xl font-bold text-primary mb-1">15K+</div>
                      <div className="text-sm text-muted-foreground">Lives Touched</div>
                    </div>
                    <div className="bg-secondary rounded-xl p-6 text-center">
                      <div className="text-2xl font-bold text-primary mb-1">50+</div>
                      <div className="text-sm text-muted-foreground">Villages Reached</div>
                    </div>
                    <div className="bg-secondary rounded-xl p-6 text-center">
                      <div className="text-2xl font-bold text-primary mb-1">200+</div>
                      <div className="text-sm text-muted-foreground">Volunteers</div>
                    </div>
                    <div className="bg-secondary rounded-xl p-6 text-center">
                      <div className="text-2xl font-bold text-primary mb-1">3</div>
                      <div className="text-sm text-muted-foreground">Years Active</div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="sticky top-24 space-y-6"
                >
                  {/* Action Buttons */}
                  <div className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Support This Project
                    </h3>
                    <div className="space-y-3">
                      <Button className="w-full" size="lg">
                        <Heart className="mr-2 h-4 w-4" />
                        Donate Now
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share Project
                      </Button>
                    </div>
                  </div>

                  {/* Partners */}
                  {project.partners && project.partners.length > 0 && (
                    <div className="bg-card rounded-xl p-6 border border-border">
                      <h3 className="text-lg font-semibold text-foreground mb-4">
                        Project Partners
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {project.partners.map((partner) => (
                          <span
                            key={partner}
                            className="px-3 py-1 bg-secondary rounded-full text-sm text-muted-foreground"
                          >
                            {partner}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sponsors */}
                  {project.sponsors && project.sponsors.length > 0 && (
                    <div className="bg-card rounded-xl p-6 border border-border">
                      <h3 className="text-lg font-semibold text-foreground mb-4">
                        Sponsors
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {project.sponsors.map((sponsor) => (
                          <span
                            key={sponsor}
                            className="px-3 py-1 bg-primary/10 rounded-full text-sm text-primary font-medium"
                          >
                            {sponsor}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Projects */}
        <section className="py-16 bg-secondary/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              Related Projects
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {projects
                .filter((p) => p.id !== project.id && p.category === project.category)
                .slice(0, 3)
                .map((relatedProject) => (
                  <Link
                    key={relatedProject.id}
                    href={`/projects/${relatedProject.id}`}
                    className="group"
                  >
                    <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={relatedProject.image}
                          alt={relatedProject.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {relatedProject.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {relatedProject.impact}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
