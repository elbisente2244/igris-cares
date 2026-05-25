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
import { projects, type Project } from "@/lib/data/projects"
import { saveProject } from "@/lib/admin/firestore-data"
import { listToText, textToList } from "@/lib/admin/form-utils"
import { loadPublicProjectById } from "@/lib/public-data"
import { ADMIN_STORAGE_KEYS, loadCollection, saveCollection, upsertById } from "@/lib/admin/local-data"

type ProjectRecord = Project & {
  created_at?: unknown
  fullDescription?: string
}

const categories = ["Education", "Health & Sanitation", "Economic Development", "Youth Development", "Humanitarian Aid"]
const statuses = ["active", "completed", "planned"]

function normalizeStatus(status?: string) {
  if (status === "ongoing") return "active"
  if (status === "active" || status === "completed" || status === "planned") return status
  return "active"
}

export default function EditProjectPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = String(params.id ?? "")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [currentProject, setCurrentProject] = useState<ProjectRecord | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fullDescription: "",
    category: "",
    status: "active",
    location: "",
    date: "",
    impact: "",
    image: "",
    videoLinksText: "",
    partnersText: "",
    sponsorsText: "",
  })

  useEffect(() => {
    if (!projectId) return

    let active = true

    ;(async () => {
      let current =
        (await loadPublicProjectById(projectId)) ??
        projects.find((item) => item.id === projectId) ??
        null

      if (!current) {
        const localProjects = loadCollection<ProjectRecord>(ADMIN_STORAGE_KEYS.projects, projects as ProjectRecord[])
        current = localProjects.find((item) => item.id === projectId) ?? null
      }

      if (!active) return

      if (!current) {
        setNotFound(true)
        setLoaded(true)
        return
      }

      const record = current as ProjectRecord
      setCurrentProject(record)
      setFormData({
        title: record.title ?? "",
        description: record.description ?? "",
        fullDescription: record.fullDescription ?? record.description ?? "",
        category: record.category ?? "",
        status: normalizeStatus(record.status),
        location: record.location ?? "",
        date: record.date ?? "",
        impact: record.impact ?? "",
        image: record.image ?? "",
        videoLinksText: listToText(record.videoLinks),
        partnersText: listToText(record.partners),
        sponsorsText: listToText(record.sponsors),
      })
      setLoaded(true)
    })()

    return () => {
      active = false
    }
  }, [projectId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const nextProject: ProjectRecord = {
      ...(currentProject ?? {
        id: projectId,
        title: "",
        description: "",
        image: "",
        location: "",
        date: "",
        impact: "",
        category: "",
        videoLinks: [],
        partners: [],
        sponsors: [],
        status: "active",
      }),
      id: projectId,
      title: formData.title,
      description: formData.description,
      fullDescription: formData.fullDescription,
      category: formData.category,
      status: formData.status as Project["status"],
      location: formData.location,
      date: formData.date,
      impact: formData.impact,
      image: formData.image,
      videoLinks: textToList(formData.videoLinksText),
      partners: textToList(formData.partnersText),
      sponsors: textToList(formData.sponsorsText),
    }

    try {
      await saveProject({
        ...nextProject,
        created_at: currentProject?.created_at ?? new Date(),
      } as Parameters<typeof saveProject>[0])
      const nextLocal = upsertById(
        loadCollection<ProjectRecord>(ADMIN_STORAGE_KEYS.projects, projects as ProjectRecord[]),
        { ...nextProject, created_at: currentProject?.created_at ?? new Date() },
      )
      saveCollection(ADMIN_STORAGE_KEYS.projects, nextLocal)
      toast.success("Project saved successfully.")
      router.push("/admin/projects")
    } catch (saveError) {
      console.error("Failed to save project:", saveError)
      const nextLocal = upsertById(
        loadCollection<ProjectRecord>(ADMIN_STORAGE_KEYS.projects, projects as ProjectRecord[]),
        { ...nextProject, created_at: currentProject?.created_at ?? new Date() },
      )
      saveCollection(ADMIN_STORAGE_KEYS.projects, nextLocal)
      toast.warning("Saved locally. Firestore update failed — check your connection.")
      router.push("/admin/projects")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!loaded) {
    return <div className="p-6">Loading project...</div>
  }

  if (notFound) {
    return (
      <div className="p-6">
        <p className="mb-4">Project not found.</p>
        <Button asChild>
          <Link href="/admin/projects">Back to Projects</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="Edit Project" />

      <div className="flex-1 p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/admin/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Link>
          </Button>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium mb-2 block">Project Title *</label>
                    <Input name="title" value={formData.title} onChange={handleChange} required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium mb-2 block">Short Description *</label>
                    <Textarea name="description" value={formData.description} onChange={handleChange} rows={3} required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium mb-2 block">Full Description</label>
                    <Textarea name="fullDescription" value={formData.fullDescription} onChange={handleChange} rows={5} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category *</label>
                    <Select value={formData.category} onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <label className="text-sm font-medium mb-2 block">Location *</label>
                    <Input name="location" value={formData.location} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Timeline / Date</label>
                    <Input name="date" value={formData.date} onChange={handleChange} placeholder="e.g. Ongoing since 2019" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Impact Statement</label>
                    <Input name="impact" value={formData.impact} onChange={handleChange} />
                  </div>
                  <div className="md:col-span-2">
                    <ImageUploadField
                      label="Featured Image"
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
                  <label className="text-sm font-medium mb-2 block">Video Links</label>
                  <Textarea name="videoLinksText" value={formData.videoLinksText} onChange={handleChange} rows={3} placeholder="One URL per line" />
                </div>
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
                <Link href="/admin/projects">Cancel</Link>
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
