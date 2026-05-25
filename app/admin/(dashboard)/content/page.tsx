"use client"

import Link from "next/link"
import { AdminHeader } from "@/components/admin/admin-sidebar"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

type ContentFile = { name: string; path: string; absolutePath?: string }

export default function ContentListPage() {
  const [files, setFiles] = useState<ContentFile[]>([])

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then(setFiles)
      .catch(() => setFiles([]))
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="Content" />
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">Editable Markdown content</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Files in <strong>content/</strong> drive homepage sections, page heroes, footer text, and image URLs (e.g. <code className="text-xs">hero.md</code> <code className="text-xs">image_url</code>, <code className="text-xs">site-media.md</code>). Projects, events, gallery, and partners lists still come from Admin → Firestore.
        </p>

        <div className="space-y-3">
          {files.map((f) => (
            <div key={f.name} className="flex items-center justify-between p-3 border rounded">
              <div>
                <div className="font-medium">{f.name}</div>
                <div className="text-xs text-muted-foreground">{f.path}</div>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/content/${encodeURIComponent(f.name)}`}>
                  <Button>Edit</Button>
                </Link>
                <a href={f.absolutePath ? `vscode://file/${f.absolutePath}` : `#`}>
                  <Button variant="outline">Open in Editor</Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
