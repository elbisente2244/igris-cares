"use client"

import { useId, useRef, useState } from "react"
import { ImagePlus, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { uploadFile } from "@/lib/firebase/storage"

type ImageUploadFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  helperText?: string
  uploadPath?: string
}

function buildUploadPath(basePath: string | undefined, file: File) {
  const safeBasePath = (basePath || "admin/uploads").replace(/\/+$/g, "")
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-")
  return `${safeBasePath}/${Date.now()}-${safeName}`
}

export function ImageUploadField({ label, value, onChange, helperText, uploadPath }: ImageUploadFieldProps) {
  const inputId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")

  const handleFileSelect = async (file: File | null) => {
    if (!file) return

    setError("")
    setIsUploading(true)

    try {
      const downloadURL = await uploadFile(buildUploadPath(uploadPath, file), file)
      onChange(downloadURL)
    } catch (uploadError) {
      console.error("Image upload failed:", uploadError)
      setError("Upload failed. You can paste an image URL instead.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="text-sm font-medium block">
        {label}
      </label>

      <div className="grid gap-3 md:grid-cols-[1fr_auto] items-start">
        <div className="space-y-3">
          <input
            id={inputId}
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
          />

          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors bg-background/40">
            <ImagePlus className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-3">
              Upload an image or paste a URL below
            </p>
            <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? "Uploading..." : "Choose Image"}
            </Button>
          </div>

          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... or uploaded file data"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />

          {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        {value ? (
          <div className="relative w-full md:w-40 aspect-square rounded-lg overflow-hidden border bg-muted">
            <img src={value} alt={label} className="h-full w-full object-cover" />
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7 rounded-full shadow"
              onClick={() => onChange("")}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="hidden md:flex w-full md:w-40 aspect-square rounded-lg border border-dashed border-muted-foreground/25 items-center justify-center text-muted-foreground bg-muted/20">
            Preview
          </div>
        )}
      </div>
    </div>
  )
}
