"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Filter,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Reply,
  X,
  MessageSquare,
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

interface Inquiry {
  id: string
  name: string
  email: string
  phone?: string
  inquiryType: string
  subject: string
  message: string
  status: "unread" | "read" | "replied" | "archived"
  createdAt: string
}

// Sample inquiries data
const sampleInquiries: Inquiry[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@company.com",
    phone: "+1 234 567 8900",
    inquiryType: "partnership",
    subject: "Corporate Partnership Opportunity",
    message: "We are interested in partnering with Igris Cares for our upcoming CSR initiatives. Our company has allocated a budget for community development projects and we believe your organization would be a great fit.",
    status: "unread",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@nonprofit.org",
    inquiryType: "volunteer",
    subject: "Volunteer Opportunity",
    message: "I represent a group of 20 volunteers who would like to participate in your upcoming community outreach programs. Please let us know how we can get involved.",
    status: "read",
    createdAt: "2024-01-14T15:45:00Z",
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "michael@foundation.org",
    phone: "+1 345 678 9012",
    inquiryType: "donation",
    subject: "Donation Inquiry",
    message: "Our foundation is interested in making a substantial donation to support your education initiatives. Could you provide more details about your current projects and funding needs?",
    status: "replied",
    createdAt: "2024-01-13T09:15:00Z",
  },
  {
    id: "4",
    name: "Emily Brown",
    email: "emily@school.edu",
    inquiryType: "general",
    subject: "School Visit Request",
    message: "We would like to arrange a visit to one of your project sites as part of our social studies curriculum. Our students are learning about community service and philanthropy.",
    status: "unread",
    createdAt: "2024-01-12T14:20:00Z",
  },
]

const statusConfig = {
  unread: { label: "Unread", icon: Clock, className: "bg-blue-100 text-blue-700" },
  read: { label: "Read", icon: Eye, className: "bg-gray-100 text-gray-700" },
  replied: { label: "Replied", icon: CheckCircle, className: "bg-green-100 text-green-700" },
  archived: { label: "Archived", icon: XCircle, className: "bg-orange-100 text-orange-700" },
}

const typeLabels: Record<string, string> = {
  partnership: "Partnership",
  volunteer: "Volunteer",
  donation: "Donation",
  general: "General",
  media: "Media",
}

export default function AdminInquiriesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [inquiries, setInquiries] = useState<Inquiry[]>(sampleInquiries)
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)

  const statuses = ["all", "unread", "read", "replied", "archived"]
  const types = ["all", "partnership", "volunteer", "donation", "general", "media"]

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.subject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "all" || inquiry.status === selectedStatus
    const matchesType = selectedType === "all" || inquiry.inquiryType === selectedType
    return matchesSearch && matchesStatus && matchesType
  })

  const unreadCount = inquiries.filter((i) => i.status === "unread").length

  const handleMarkAsRead = (id: string) => {
    setInquiries(inquiries.map((i) => 
      i.id === id ? { ...i, status: "read" as const } : i
    ))
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this inquiry?")) {
      setInquiries(inquiries.filter((i) => i.id !== id))
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(null)
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="Inquiries" />

      <div className="flex-1 p-6 space-y-6">
        {/* Stats Bar */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
            <MessageSquare className="h-5 w-5 text-primary" />
            <span className="font-medium">{inquiries.length} Total</span>
          </div>
          {unreadCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-lg">
              <Clock className="h-5 w-5 text-blue-700" />
              <span className="font-medium text-blue-700">{unreadCount} Unread</span>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search inquiries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                {selectedStatus === "all" ? "All Status" : statusConfig[selectedStatus as keyof typeof statusConfig]?.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {statuses.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                >
                  {status === "all" ? "All Status" : statusConfig[status as keyof typeof statusConfig]?.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                {selectedType === "all" ? "All Types" : typeLabels[selectedType]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {types.map((type) => (
                <DropdownMenuItem
                  key={type}
                  onClick={() => setSelectedType(type)}
                >
                  {type === "all" ? "All Types" : typeLabels[type]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Inquiries List */}
        <div className="space-y-3">
          {filteredInquiries.map((inquiry, index) => {
            const status = statusConfig[inquiry.status]
            return (
              <motion.div
                key={inquiry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`
                    cursor-pointer hover:shadow-md transition-all
                    ${inquiry.status === "unread" ? "border-l-4 border-l-primary bg-primary/5" : ""}
                  `}
                  onClick={() => {
                    setSelectedInquiry(inquiry)
                    if (inquiry.status === "unread") {
                      handleMarkAsRead(inquiry.id)
                    }
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-medium truncate ${inquiry.status === "unread" ? "font-semibold" : ""}`}>
                            {inquiry.name}
                          </h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
                            <status.icon className="h-3 w-3" />
                            {status.label}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                            {typeLabels[inquiry.inquiryType]}
                          </span>
                        </div>
                        <p className={`text-sm ${inquiry.status === "unread" ? "text-foreground font-medium" : "text-muted-foreground"} mb-1 truncate`}>
                          {inquiry.subject}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {inquiry.message}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-muted-foreground">
                          {formatDate(inquiry.createdAt)}
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation()
                              window.location.href = `mailto:${inquiry.email}?subject=Re: ${inquiry.subject}`
                            }}
                          >
                            <Reply className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(inquiry.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {filteredInquiries.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No inquiries found.</p>
          </div>
        )}
      </div>

      {/* Inquiry Detail Modal */}
      <AnimatePresence>
        {selectedInquiry && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setSelectedInquiry(null)}
            />
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-lg bg-background shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Inquiry Details</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedInquiry(null)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{selectedInquiry.subject}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[selectedInquiry.status].className}`}>
                      {statusConfig[selectedInquiry.status].label}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                      {typeLabels[selectedInquiry.inquiryType]}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {selectedInquiry.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{selectedInquiry.name}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(selectedInquiry.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${selectedInquiry.email}`} className="hover:text-primary">
                      {selectedInquiry.email}
                    </a>
                  </div>

                  {selectedInquiry.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <a href={`tel:${selectedInquiry.phone}`} className="hover:text-primary">
                        {selectedInquiry.phone}
                      </a>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-medium mb-2">Message</h4>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedInquiry.message}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t flex items-center gap-3">
                <Button
                  className="flex-1"
                  onClick={() => {
                    window.location.href = `mailto:${selectedInquiry.email}?subject=Re: ${selectedInquiry.subject}`
                  }}
                >
                  <Reply className="h-4 w-4 mr-2" />
                  Reply via Email
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDelete(selectedInquiry.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
