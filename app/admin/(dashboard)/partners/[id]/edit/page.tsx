"use client"

import { Suspense, useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { toast } from "sonner"
import { AdminHeader } from "@/components/admin/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUploadField } from "@/components/admin/image-upload-field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { partners as seedPartners, sponsors as seedSponsors } from "@/lib/data/partners"
import { getPartnerById, getSponsorById, savePartner, saveSponsor } from "@/lib/admin/firestore-data"
import { listToText, textToList } from "@/lib/admin/form-utils"

const sponsorTiers = ["platinum", "gold", "silver", "bronze"]

function EditPartnerForm() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const recordId = String(params.id ?? "")
  const recordType = searchParams.get("type") === "sponsor" ? "sponsor" : "partner"

  const [loaded, setLoaded] = useState(false)
  const [notFound, setNotFound] = useState(false)
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

  useEffect(() => {
    if (!recordId) return

    let active = true

    ;(async () => {
      if (recordType === "sponsor") {
        const current =
          (await getSponsorById(recordId)) ?? seedSponsors.find((s) => s.id === recordId) ?? null

        if (!active) return
        if (!current) {
          setNotFound(true)
          setLoaded(true)
          return
        }

        setFormData({
          name: current.name,
          description: current.description,
          logo: current.logo ?? "",
          website: "",
          contactPerson: "",
          tier: current.tier,
          projectsText: "",
          areasText: listToText(current.contributionAreas),
        })
      } else {
        const current =
          (await getPartnerById(recordId)) ?? seedPartners.find((p) => p.id === recordId) ?? null

        if (!active) return
        if (!current) {
          setNotFound(true)
          setLoaded(true)
          return
        }

        setFormData({
          name: current.name,
          description: current.description,
          logo: current.logo ?? "",
          website: current.website ?? "",
          contactPerson: current.contactPerson ?? "",
          tier: "silver",
          projectsText: listToText(current.projectsSupported),
          areasText: "",
        })
      }

      if (active) setLoaded(true)
    })()

    return () => {
      active = false
    }
  }, [recordId, recordType])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (recordType === "sponsor") {
        await saveSponsor({
          id: recordId,
          name: formData.name,
          logo: formData.logo || null,
          tier: formData.tier,
          description: formData.description,
          contributionAreas: textToList(formData.areasText),
        })
      } else {
        await savePartner({
          id: recordId,
          name: formData.name,
          logo: formData.logo || null,
          description: formData.description,
          contactPerson: formData.contactPerson,
          website: formData.website,
          projectsSupported: textToList(formData.projectsText),
        })
      }

      toast.success(recordType === "sponsor" ? "Sponsor saved." : "Partner saved.")
      router.push("/admin/partners")
    } catch (error) {
      console.error(error)
      toast.error("Failed to save. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!loaded) {
    return <div className="p-6">Loading...</div>
  }

  if (notFound) {
    return (
      <div className="p-6">
        <p className="mb-4">{recordType === "sponsor" ? "Sponsor" : "Partner"} not found.</p>
        <Button asChild>
          <Link href="/admin/partners">Back</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title={recordType === "sponsor" ? "Edit Sponsor" : "Edit Partner"} />

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
              <CardTitle>Details</CardTitle>
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
                    <Textarea name="areasText" value={formData.areasText} onChange={handleChange} rows={3} />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Website</label>
                    <Input name="website" value={formData.website} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Contact person</label>
                    <Input name="contactPerson" value={formData.contactPerson} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Projects supported</label>
                    <Textarea name="projectsText" value={formData.projectsText} onChange={handleChange} rows={3} />
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
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function EditPartnerPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <EditPartnerForm />
    </Suspense>
  )
}
