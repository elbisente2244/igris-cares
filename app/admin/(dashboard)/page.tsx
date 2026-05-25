"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  FolderKanban,
  Calendar,
  Users,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
  Heart,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { AdminHeader } from "@/components/admin/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getDashboardSummary, type DashboardSummary } from "@/lib/admin/firestore-data"

const activityIcons = {
  project: FolderKanban,
  event: Calendar,
  partner: Users,
  inquiry: MessageSquare,
}

const activityLinks: Record<string, string> = {
  project: "/admin/projects",
  event: "/admin/events",
  partner: "/admin/partners",
  inquiry: "/admin/inquiries",
}

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const data = await getDashboardSummary()
        if (active) setSummary(data)
      } catch {
        if (active) setSummary(null)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  const stats = [
    {
      name: "Total Projects",
      value: String(summary?.projectCount ?? "—"),
      change: "From Firestore",
      changeType: "neutral" as const,
      icon: FolderKanban,
      href: "/admin/projects",
    },
    {
      name: "Upcoming Events",
      value: String(summary?.upcomingEventCount ?? "—"),
      change: "Matches public /events",
      changeType: "neutral" as const,
      icon: Calendar,
      href: "/admin/events",
    },
    {
      name: "Partners & Sponsors",
      value: String(summary?.partnerCount ?? "—"),
      change: `${summary?.sponsorCount ?? 0} sponsors`,
      changeType: "positive" as const,
      icon: Users,
      href: "/admin/partners",
    },
    {
      name: "New Inquiries",
      value: String(summary?.unreadInquiryCount ?? "—"),
      change: "From contact form",
      changeType: summary?.unreadInquiryCount ? ("warning" as const) : ("neutral" as const),
      icon: MessageSquare,
      href: "/admin/inquiries",
    },
  ]

  const quickActions = [
    { name: "Add Project", href: "/admin/projects/new", icon: FolderKanban },
    { name: "Create Event", href: "/admin/events/new", icon: Calendar },
    { name: "Edit Content", href: "/admin/content", icon: FileText },
    { name: "Upload Photos", href: "/admin/gallery", icon: Heart },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="Dashboard" />

      <div className="flex-1 p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary to-accent rounded-2xl p-6 text-primary-foreground"
        >
          <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
          <p className="text-primary-foreground/80 mb-4">
            Stats and activity reflect live data shown on the public website.
          </p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.name}
                variant="secondary"
                size="sm"
                asChild
                className="bg-white/20 hover:bg-white/30 text-primary-foreground border-0"
              >
                <Link href={action.href}>
                  <action.icon className="h-4 w-4 mr-2" />
                  {action.name}
                </Link>
              </Button>
            ))}
          </div>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={stat.href}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer group">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.name}
                    </CardTitle>
                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <stat.icon className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <p
                      className={`text-xs mt-1 flex items-center gap-1 ${
                        stat.changeType === "positive"
                          ? "text-green-600"
                          : stat.changeType === "warning"
                            ? "text-orange-600"
                            : "text-muted-foreground"
                      }`}
                    >
                      {stat.changeType === "positive" && <TrendingUp className="h-3 w-3" />}
                      {stat.change}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary" asChild>
                <Link href="/admin/inquiries">
                  View Inquiries
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(summary?.recentActivity ?? []).length === 0 ? (
                  <p className="text-sm text-muted-foreground">No recent activity yet.</p>
                ) : (
                  summary?.recentActivity.map((activity, index) => {
                    const Icon = activityIcons[activity.type]
                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={activityLinks[activity.type]}
                          className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                          </div>
                        </Link>
                      </motion.div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Impact Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl">
                <div className="text-4xl font-bold text-primary mb-1">
                  {summary ? summary.projectCount * 1000 + "+" : "—"}
                </div>
                <p className="text-sm text-muted-foreground">Estimated reach</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Projects</span>
                  <span className="font-semibold">{summary?.projectCount ?? "—"}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{
                      width: summary ? `${Math.min(100, (summary.projectCount / 24) * 100)}%` : "0%",
                    }}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Upcoming Events</span>
                  <span className="font-semibold">{summary?.upcomingEventCount ?? "—"}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-accent h-2 rounded-full"
                    style={{
                      width: summary ? `${Math.min(100, (summary.upcomingEventCount / 8) * 100)}%` : "0%",
                    }}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Partners</span>
                  <span className="font-semibold">{summary?.partnerCount ?? "—"}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: summary ? `${Math.min(100, (summary.partnerCount / 16) * 100)}%` : "0%",
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
