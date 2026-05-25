"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Save } from "lucide-react"
import { toast } from "sonner"
import { AdminHeader } from "@/components/admin/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUploadField } from "@/components/admin/image-upload-field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { events, type Event } from "@/lib/data/events"
import { saveEvent } from "@/lib/admin/firestore-data"
import { listToText, textToList, toDateInputValue } from "@/lib/admin/form-utils"
import { loadPublicEventById } from "@/lib/public-data"
import { toAdminEventStatus } from "@/lib/data/status"

const statuses = ["upcoming", "ongoing", "past"]

type EditableEvent = Event & {
  title?: string
  capacity?: string
  projectId?: string
}

export default function EditEventPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = String(params.id ?? "")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [currentEvent, setCurrentEvent] = useState<EditableEvent | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
    status: "upcoming",
    capacity: "",
    image: "",
    projectId: "",
    partnersText: "",
    sponsorsText: "",
  })

  useEffect(() => {
    if (!eventId) return

    let active = true

    ;(async () => {
      const current =
        ((await loadPublicEventById(eventId)) as EditableEvent | null) ??
        (events.find((item) => item.id === eventId) as EditableEvent | undefined) ??
        null

      if (!active) return

      if (!current) {
        setNotFound(true)
        setLoaded(true)
        return
      }

      setCurrentEvent(current)
      setFormData({
        title: current.title ?? current.name ?? "",
        description: current.description ?? "",
        location: current.location ?? "",
        date: toDateInputValue(current.date),
        time: current.time ?? "",
        status: toAdminEventStatus(current.status),
        capacity: current.capacity ? String(current.capacity) : current.attendees ? String(current.attendees) : "",
        image: current.image ?? (Array.isArray(current.photos) ? current.photos[0] : "") ?? "",
        projectId: current.projectId ?? "",
        partnersText: listToText(current.partners),
        sponsorsText: listToText(current.sponsors),
      })
      setLoaded(true)
    })()

    return () => {
      active = false
    }
  }, [eventId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const nextEvent: EditableEvent = {
        ...(currentEvent ?? {
          id: eventId,
          name: "",
          description: "",
          location: "",
          date: "",
          time: "",
          projectId: "",
          image: "",
          photos: [],
          partners: [],
          sponsors: [],
          status: "upcoming",
          attendees: 0,
        }),
        id: eventId,
        name: formData.title,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        date: formData.date,
        time: formData.time,
        status: formData.status as Event["status"],
        capacity: formData.capacity,
        image: formData.image,
        projectId: formData.projectId,
        partners: textToList(formData.partnersText),
        sponsors: textToList(formData.sponsorsText),
        photos: formData.image
          ? [formData.image, ...(currentEvent?.photos ?? []).filter((p) => p !== formData.image)]
          : currentEvent?.photos ?? [],
        attendees: formData.capacity
          ? Number.parseInt(formData.capacity, 10)
          : (currentEvent?.attendees ?? 0),
      }

      await saveEvent({
        ...nextEvent,
        created_at: (currentEvent as EditableEvent & { created_at?: unknown })?.created_at ?? new Date(),
      } as Parameters<typeof saveEvent>[0])

      toast.success("Event saved successfully.")
      router.push("/admin/events")
    } catch (error) {
      console.error(error)
      toast.error("Failed to save event. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!loaded) {
    return <div className="p-6">Loading event...</div>
  }

  if (notFound) {
    return (
      <div className="p-6">
        <p className="mb-4">Event not found.</p>
        <Button asChild>
          <Link href="/admin/events">Back to Events</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="Edit Event" />

      <div className="flex-1 p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/admin/events">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
          </Button>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium mb-2 block">Event Title *</label>
                    <Input name="title" value={formData.title} onChange={handleChange} required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium mb-2 block">Short Description *</label>
                    <Textarea name="description" value={formData.description} onChange={handleChange} rows={3} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Status</label>
                    <Select value={formData.status} onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status} value={status} className="capitalize">{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Project ID</label>
                    <Input name="projectId" value={formData.projectId} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Location *</label>
                    <Input name="location" value={formData.location} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Capacity</label>
                    <Input name="capacity" value={formData.capacity} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Date *</label>
                    <Input type="date" name="date" value={formData.date} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Time</label>
                    <Input name="time" value={formData.time} onChange={handleChange} placeholder="e.g. 9:00 AM - 4:00 PM" />
                  </div>
                  <div className="md:col-span-2">
                    <ImageUploadField
                      label="Event Image"
                      value={formData.image}
                      onChange={(value) => setFormData((prev) => ({ ...prev, image: value }))}
                      helperText="Choose a file or paste an image URL."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Linked Content</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Partners</label>
                  <Textarea name="partnersText" value={formData.partnersText} onChange={handleChange} rows={3} placeholder="One partner per line" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Sponsors</label>
                  <Textarea name="sponsorsText" value={formData.sponsorsText} onChange={handleChange} rows={3} placeholder="One sponsor per line" />
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-end gap-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/events">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : <><Save className="h-4 w-4 mr-2" />Save Changes</>}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
