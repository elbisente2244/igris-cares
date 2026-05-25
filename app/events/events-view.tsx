"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, MapPin, Clock, Users, ArrowRight } from "lucide-react"
import { PageHero } from "@/components/page-hero"
import { Button } from "@/components/ui/button"
import { events, type Event } from "@/lib/data/events"
import { loadPublicEvents } from "@/lib/public-data"
import type { PageCopy } from "@/lib/page-copy"
import { str } from "@/lib/page-copy"

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function EventsPageView({ pageCopy }: { pageCopy: PageCopy }) {
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all")
  const [eventList, setEventList] = useState<Event[]>(events)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const nextEvents = await loadPublicEvents()
        if (active) setEventList(nextEvents.length > 0 ? nextEvents : events)
      } catch {
        if (active) setEventList(events)
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  const filteredEvents = useMemo(() => {
    if (filter === "all") return eventList
    return eventList.filter((event) => event.status === filter)
  }, [eventList, filter])

  const upcomingEvents = eventList.filter((e) => e.status === "upcoming")
  const pastEvents = eventList.filter((e) => e.status === "past")

  return (
    <main className="pt-16">
      <PageHero
        kicker={str(pageCopy, "kicker", "Community Events")}
        title={str(pageCopy, "title", "Join Us in Making a Difference")}
        description={str(
          pageCopy,
          "description",
          "Be part of our events and witness the impact we create together. From health fairs to graduation ceremonies, every event brings us closer to our mission.",
        )}
      />

      <section className="py-8 border-b border-border bg-background sticky top-16 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              All Events ({eventList.length})
            </button>
            <button
              onClick={() => setFilter("upcoming")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === "upcoming"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              Upcoming ({upcomingEvents.length})
            </button>
            <button
              onClick={() => setFilter("past")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === "past"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              Past ({pastEvents.length})
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">Loading events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No events found.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredEvents.map((event, index) => (
                <motion.article
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/events/${event.id}`} className="block group">
                    <div className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300">
                      <div className="grid md:grid-cols-3 gap-0">
                        <div className="aspect-video md:aspect-auto overflow-hidden bg-secondary">
                          <img
                            src={event.image}
                            alt={event.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.currentTarget.style.display = "none"
                            }}
                          />
                        </div>
                        <div className="md:col-span-2 p-6 md:p-8 flex flex-col justify-center">
                          <div className="flex items-center gap-3 mb-4">
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-full ${
                                event.status === "upcoming"
                                  ? "bg-primary/10 text-primary"
                                  : "bg-secondary text-muted-foreground"
                              }`}
                            >
                              {event.status === "upcoming" ? "Upcoming" : "Past Event"}
                            </span>
                          </div>
                          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                            {event.name}
                          </h2>
                          <p className="text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                            <span className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-primary" />
                              {formatDate(event.date)}
                            </span>
                            <span className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-primary" />
                              {event.time}
                            </span>
                            <span className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-primary" />
                              {event.location}
                            </span>
                            <span className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-primary" />
                              {event.attendees}+ {event.status === "upcoming" ? "expected" : "attended"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-primary font-medium">
                            <span>View Details</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-secondary/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            {str(pageCopy, "cta_title", "Want to Host an Event with Us?")}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            {str(
              pageCopy,
              "cta_description",
              "Partner with IGRIS CARES to organize impactful community events. We provide resources, volunteers, and expertise.",
            )}
          </p>
          <Button size="lg" asChild>
            <Link href={str(pageCopy, "cta_link", "/contact")}>{str(pageCopy, "cta_button", "Contact Us")}</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
