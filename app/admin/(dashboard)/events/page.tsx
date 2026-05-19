"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  Users,
} from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { events, type Event } from "@/lib/data/events"

const statusConfig = {
  upcoming: { label: "Upcoming", className: "bg-blue-100 text-blue-700" },
  ongoing: { label: "Ongoing", className: "bg-green-100 text-green-700" },
  completed: { label: "Completed", className: "bg-gray-100 text-gray-700" },
}

export default function AdminEventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [eventList, setEventList] = useState<Event[]>(events)

  const filteredEvents = eventList.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "all" || event.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      setEventList(eventList.filter((e) => e.id !== id))
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="Events" />

      <div className="flex-1 p-6 space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  {selectedStatus === "all" ? "All Status" : selectedStatus}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setSelectedStatus("all")}>
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("upcoming")}>
                  Upcoming
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("ongoing")}>
                  Ongoing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("completed")}>
                  Completed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button asChild>
            <Link href="/admin/events/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Link>
          </Button>
        </div>

        {/* Events Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event, index) => {
            const status = statusConfig[event.status]
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div
                    className="h-40 bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${event.image})` }}
                  >
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.className}`}>
                        {status.label}
                      </span>
                    </div>
                    <div className="absolute top-3 left-3 bg-background rounded-lg p-2 text-center shadow">
                      <p className="text-xs font-medium text-muted-foreground">
                        {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                      </p>
                      <p className="text-lg font-bold">
                        {new Date(event.date).getDate()}
                      </p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-1">
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </span>
                      {event.capacity && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {event.capacity}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/events/${event.id}`} target="_blank">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/events/${event.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(event.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No events found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
