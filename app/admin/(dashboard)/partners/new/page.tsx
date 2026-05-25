"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUploadField } from "@/components/admin/image-upload-field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { savePartner, saveSponsor } from "@/lib/admin/firestore-data"

const sponsorTiers = ["platinum", "gold", "silver", "bronze"]

function textToList(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function NewPartnerForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const recordType = searchParams.get("type") === "sponsor" ? "sponsor" : "partner"
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: "",
    website: "",
    contactPerson: "",
    tier: "silver",
    projectsText: "",
    areasText: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const id = crypto.randomUUID()

    try {
      if (recordType === "sponsor") {
        await saveSponsor({
          id,
          name: formData.name,
          logo: formData.logo || null,
          tier: formData.tier,
          description: formData.description,
          contributionAreas: textToList(formData.areasText),
        })
      } else {
        await savePartner({
          id,
          name: formData.name,
          logo: formData.logo || null,
          description: formData.description,
          contactPerson: formData.contactPerson,
          website: formData.website,
          projectsSupported: textToList(formData.projectsText),
        })
      }
      toast.success(recordType === "sponsor" ? "Sponsor created." : "Partner created.")
      router.push("/admin/partners")
    } catch {
      toast.error("Failed to create record.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title={recordType === "sponsor" ? "New Sponsor" : "New Partner"} />

      <div className="flex-1 p-6">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/admin/partners">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{recordType === "sponsor" ? "Sponsor" : "Partner"} details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Name *</label>
                <Input name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Description *</label>
                <Textarea name="description" value={formData.description} onChange={handleChange} rows={4} required />
              </div>
              <ImageUploadField
                label="Logo"
                value={formData.logo}
                onChange={(value) => setFormData((prev) => ({ ...prev, logo: value }))}
              />
              {recordType === "sponsor" ? (
                <>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tier</label>
                    <Select value={formData.tier} onValueChange={(value) => setFormData((prev) => ({ ...prev, tier: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sponsorTiers.map((tier) => (
                          <SelectItem key={tier} value={tier} className="capitalize">
                            {tier}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Contribution areas</label>
                    <Textarea
                      name="areasText"
                      value={formData.areasText}
                      onChange={handleChange}
                      rows={3}
                      placeholder="One area per line"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Website</label>
                    <Input name="website" value={formData.website} onChange={handleChange} placeholder="https://..." />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Contact person</label>
                    <Input name="contactPerson" value={formData.contactPerson} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Projects supported</label>
                    <Textarea
                      name="projectsText"
                      value={formData.projectsText}
                      onChange={handleChange}
                      rows={3}
                      placeholder="One project per line"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/partners">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Saving..." : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function NewPartnerPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <NewPartnerForm />
    </Suspense>
  )
}
