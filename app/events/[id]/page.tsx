"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, MapPin, Calendar, Clock, Users, Share2, CalendarPlus } from "lucide-react"
import { Header } from "@/components/header"
import { FooterUI } from "@/components/footer-ui"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { events, type Event } from "@/lib/data/events"
import { projects, type Project } from "@/lib/data/projects"
import { loadPublicEventById, loadPublicEvents, loadPublicProjects } from "@/lib/public-data"
import { buildContactUrl, sharePage } from "@/lib/client/share"

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function EventDetailPage() {
  const params = useParams()
  const [event, setEvent] = useState<Event | null>(events.find((e) => e.id === params.id) ?? null)
  const [allEvents, setAllEvents] = useState<Event[]>(events)
  const [relatedProject, setRelatedProject] = useState<Project | null>(null)
  const [loaded, setLoaded] = useState(false)

  const handleShare = async () => {
    if (!event) return
    const result = await sharePage(event.name)
    if (result === "copied") toast.success("Event link copied to clipboard.")
    else if (result) toast.success("Thanks for sharing!")
  }

  useEffect(() => {
    let active = true
    ;(async () => {
      const [nextEvents, allProjects] = await Promise.all([loadPublicEvents(), loadPublicProjects()])
      const current = await loadPublicEventById(String(params.id))
      if (!active) return
      setAllEvents(nextEvents)
      setEvent(current)
      const projectId = current ? (current.projectId ?? (current as Event & { project_id?: string }).project_id) : undefined
      setRelatedProject(projectId ? allProjects.find((p) => p.id === projectId) ?? null : null)
      setLoaded(true)
    })()
    return () => {
      active = false
    }
  }, [params.id])

  if (!loaded) {
    return (
      <>
        <Header />
        <main className="pt-16 min-h-screen flex items-center justify-center">
          <div className="text-center text-muted-foreground">Loading event...</div>
        </main>
        <FooterUI />
      </>
    )
  }

  if (!event) {
    return (
      <>
        <Header />
        <main className="pt-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
            <Button asChild>
              <Link href="/events">Back to Events</Link>
            </Button>
          </div>
        </main>
        <FooterUI />
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
              src={event.image}
              alt={event.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent" />
          </div>

          {/* Back Button */}
          <div className="absolute top-6 left-6 z-10">
            <Button variant="secondary" size="sm" asChild>
              <Link href="/events">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Events
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
                <span
                  className={`inline-block px-3 py-1 text-xs font-medium rounded-full mb-4 ${
                    event.status === "upcoming"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background/20 text-background"
                  }`}
                >
                  {event.status === "upcoming" ? "Upcoming Event" : "Past Event"}
                </span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-background mb-4">
                  {event.name}
                </h1>
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
                  {/* Event Details Card */}
                  <div className="bg-card rounded-xl p-6 border border-border mb-8">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Date</p>
                          <p className="font-medium text-foreground">{formatDate(event.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Time</p>
                          <p className="font-medium text-foreground">{event.time}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Location</p>
                          <p className="font-medium text-foreground">{event.location}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Attendance</p>
                          <p className="font-medium text-foreground">
                            {event.attendees}+ {event.status === "upcoming" ? "expected" : "attended"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    About This Event
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-8">
                    {event.description}
                  </p>

                  {/* Event Photos */}
                  {event.photos && event.photos.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-foreground mb-4">
                        Event Photos
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {event.photos.map((photo, index) => (
                          <div
                            key={index}
                            className="aspect-video rounded-xl overflow-hidden"
                          >
                            <img
                              src={photo}
                              alt={`${event.name} photo ${index + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Related Project */}
                  {relatedProject && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-foreground mb-4">
                        Related Project
                      </h3>
                      <Link href={`/projects/${relatedProject.id}`} className="block group">
                        <div className="bg-secondary rounded-xl p-4 flex items-center gap-4 hover:bg-secondary/80 transition-colors">
                          <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={relatedProject.image}
                              alt={relatedProject.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {relatedProject.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {relatedProject.category}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  )}
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
                  {event.status === "upcoming" && (
                    <div className="bg-card rounded-xl p-6 border border-border">
                      <h3 className="text-lg font-semibold text-foreground mb-4">
                        Join This Event
                      </h3>
                      <div className="space-y-3">
                        <Button className="w-full" size="lg" asChild>
                          <Link
                            href={buildContactUrl({
                              subject: `Registration: ${event.name}`,
                              inquiryType: "volunteer",
                            })}
                          >
                            <CalendarPlus className="mr-2 h-4 w-4" />
                            Register Now
                          </Link>
                        </Button>
                        <Button variant="outline" className="w-full" onClick={handleShare}>
                          <Share2 className="mr-2 h-4 w-4" />
                          Share Event
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Partners */}
                  {event.partners && event.partners.length > 0 && (
                    <div className="bg-card rounded-xl p-6 border border-border">
                      <h3 className="text-lg font-semibold text-foreground mb-4">
                        Event Partners
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {event.partners.map((partner) => (
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
                  {event.sponsors && event.sponsors.length > 0 && (
                    <div className="bg-card rounded-xl p-6 border border-border">
                      <h3 className="text-lg font-semibold text-foreground mb-4">
                        Event Sponsors
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {event.sponsors.map((sponsor) => (
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

        {/* Other Events */}
        <section className="py-16 bg-secondary/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              Other Events
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {allEvents
                .filter((e) => e.id !== event.id)
                .slice(0, 3)
                .map((otherEvent) => (
                  <Link
                    key={otherEvent.id}
                    href={`/events/${otherEvent.id}`}
                    className="group"
                  >
                    <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={otherEvent.image}
                          alt={otherEvent.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <span
                          className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full mb-2 ${
                            otherEvent.status === "upcoming"
                              ? "bg-primary/10 text-primary"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {otherEvent.status === "upcoming" ? "Upcoming" : "Past"}
                        </span>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {otherEvent.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatDate(otherEvent.date)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>
      <FooterUI />
    </>
  )
}
