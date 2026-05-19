"use client"

import { motion } from "framer-motion"
import {
  FolderKanban,
  Calendar,
  Users,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
  DollarSign,
  Heart,
} from "lucide-react"
import Link from "next/link"
import { AdminHeader } from "@/components/admin/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const stats = [
  {
    name: "Total Projects",
    value: "24",
    change: "+2 this month",
    changeType: "positive",
    icon: FolderKanban,
    href: "/admin/projects",
  },
  {
    name: "Upcoming Events",
    value: "8",
    change: "3 this week",
    changeType: "neutral",
    icon: Calendar,
    href: "/admin/events",
  },
  {
    name: "Partners",
    value: "45",
    change: "+5 new",
    changeType: "positive",
    icon: Users,
    href: "/admin/partners",
  },
  {
    name: "New Inquiries",
    value: "12",
    change: "4 unread",
    changeType: "warning",
    icon: MessageSquare,
    href: "/admin/inquiries",
  },
]

const recentActivity = [
  {
    id: 1,
    type: "project",
    title: "Community Health Initiative updated",
    time: "2 hours ago",
    icon: FolderKanban,
  },
  {
    id: 2,
    type: "event",
    title: "New event: Youth Leadership Summit",
    time: "5 hours ago",
    icon: Calendar,
  },
  {
    id: 3,
    type: "partner",
    title: "ABC Foundation joined as Gold Partner",
    time: "1 day ago",
    icon: Users,
  },
  {
    id: 4,
    type: "inquiry",
    title: "New partnership inquiry received",
    time: "1 day ago",
    icon: MessageSquare,
  },
  {
    id: 5,
    type: "donation",
    title: "Donation of $5,000 received",
    time: "2 days ago",
    icon: DollarSign,
  },
]

const quickActions = [
  { name: "Add Project", href: "/admin/projects/new", icon: FolderKanban },
  { name: "Create Event", href: "/admin/events/new", icon: Calendar },
  { name: "Upload Photos", href: "/admin/gallery", icon: Heart },
  { name: "View Inquiries", href: "/admin/inquiries", icon: MessageSquare },
]

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="Dashboard" />
      
      <div className="flex-1 p-6 space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary to-accent rounded-2xl p-6 text-primary-foreground"
        >
          <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
          <p className="text-primary-foreground/80 mb-4">
            Here&apos;s what&apos;s happening with your CSR initiatives today.
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

        {/* Stats Grid */}
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
                    <p className={`text-xs mt-1 flex items-center gap-1 ${
                      stat.changeType === "positive" 
                        ? "text-green-600" 
                        : stat.changeType === "warning"
                        ? "text-orange-600"
                        : "text-muted-foreground"
                    }`}>
                      {stat.changeType === "positive" && <TrendingUp className="h-3 w-3" />}
                      {stat.change}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary">
                View All
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Impact Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Impact Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl">
                <div className="text-4xl font-bold text-primary mb-1">25,000+</div>
                <p className="text-sm text-muted-foreground">Lives Impacted</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Projects</span>
                  <span className="font-semibold">18</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "75%" }} />
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Events This Year</span>
                  <span className="font-semibold">42</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full" style={{ width: "60%" }} />
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Volunteer Hours</span>
                  <span className="font-semibold">12,500</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "85%" }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
