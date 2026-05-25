"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { AdminHeader } from "@/components/admin/admin-sidebar"
import { Button } from "@/components/ui/button"

interface FilePayload {
  name: string
  content: string
}

export default function ContentEditor() {
  const params = useParams()
  const router = useRouter()
  const fileName = decodeURIComponent(String(params.name ?? ""))
  const [file, setFile] = useState<FilePayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!fileName) return

    fetch(`/api/admin/content?name=${encodeURIComponent(fileName)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          toast.error("Could not load content file.")
          return
        }
        setFile(data)
      })
      .catch(() => toast.error("Could not load content file."))
      .finally(() => setLoading(false))
  }, [fileName])

  if (loading) return <div className="p-6">Loading…</div>

  if (!file) return <div className="p-6">File not found</div>

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title={`Edit: ${file.name}`} />
      <div className="flex-1 p-6">
        <div className="mb-4">
          <Button variant="secondary" onClick={() => router.back()}>
            Back
          </Button>
        </div>

        <div>
          <textarea
            className="w-full h-[60vh] p-3 border rounded font-mono text-sm"
            value={file.content}
            onChange={(e) => setFile({ ...file, content: e.target.value })}
          />
        </div>

        <div className="mt-3">
          <Button
            onClick={async () => {
              setSaving(true)
              try {
                const response = await fetch("/api/admin/content", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ name: file.name, content: file.content }),
                })
                if (!response.ok) throw new Error("Save failed")
                toast.success("Content saved. Refresh the public site to see changes.")
                router.refresh()
              } catch {
                toast.error("Failed to save content.")
              } finally {
                setSaving(false)
              }
            }}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  )
}
