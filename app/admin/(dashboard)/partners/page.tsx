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
  ExternalLink,
  Award,
  Star,
  Trophy,
  Medal,
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
import { partners, type Partner } from "@/lib/data/partners"

const tierConfig = {
  platinum: { label: "Platinum", icon: Trophy, className: "bg-gradient-to-r from-slate-700 to-slate-500 text-white" },
  gold: { label: "Gold", icon: Star, className: "bg-gradient-to-r from-amber-500 to-yellow-500 text-white" },
  silver: { label: "Silver", icon: Medal, className: "bg-gradient-to-r from-slate-400 to-slate-300 text-slate-800" },
  bronze: { label: "Bronze", icon: Award, className: "bg-gradient-to-r from-orange-700 to-orange-500 text-white" },
}

export default function AdminPartnersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTier, setSelectedTier] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [partnerList, setPartnerList] = useState<Partner[]>(partners)

  const tiers = ["all", "platinum", "gold", "silver", "bronze"]
  const types = ["all", "sponsor", "partner"]

  const filteredPartners = partnerList.filter((partner) => {
    const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTier = selectedTier === "all" || partner.tier === selectedTier
    const matchesType = selectedType === "all" || partner.type === selectedType
    return matchesSearch && matchesTier && matchesType
  })

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this partner?")) {
      setPartnerList(partnerList.filter((p) => p.id !== id))
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="Partners & Sponsors" />

      <div className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          {Object.entries(tierConfig).map(([tier, config]) => {
            const count = partnerList.filter((p) => p.tier === tier).length
            return (
              <Card key={tier} className="overflow-hidden">
                <CardContent className={`p-4 ${config.className}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">{config.label}</p>
                      <p className="text-2xl font-bold">{count}</p>
                    </div>
                    <config.icon className="h-8 w-8 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-4 w-full sm:w-auto flex-wrap">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search partners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  {selectedTier === "all" ? "All Tiers" : selectedTier}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {tiers.map((tier) => (
                  <DropdownMenuItem
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className="capitalize"
                  >
                    {tier === "all" ? "All Tiers" : tier}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  {selectedType === "all" ? "All Types" : selectedType}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {types.map((type) => (
                  <DropdownMenuItem
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className="capitalize"
                  >
                    {type === "all" ? "All Types" : type}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button asChild>
            <Link href="/admin/partners/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Partner
            </Link>
          </Button>
        </div>

        {/* Partners Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPartners.map((partner, index) => {
            const tier = tierConfig[partner.tier as keyof typeof tierConfig]
            return (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-16 h-16 rounded-lg bg-muted flex-shrink-0 bg-cover bg-center"
                        style={{ backgroundImage: partner.logo ? `url(${partner.logo})` : undefined }}
                      >
                        {!partner.logo && (
                          <div className="w-full h-full flex items-center justify-center text-xl font-bold text-muted-foreground">
                            {partner.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground truncate">
                            {partner.name}
                          </h3>
                          {partner.website && (
                            <a
                              href={partner.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${tier.className}`}>
                            <tier.icon className="h-3 w-3" />
                            {tier.label}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
                            {partner.type}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {partner.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/partners/${partner.id}/edit`}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(partner.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {filteredPartners.length === 0 && (
          <div className="text-center py-12">
            <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No partners found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
