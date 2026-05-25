"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  Eye,
  X,
  Upload,
  ImagePlus,
  CheckCircle,
} from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUploadField } from "@/components/admin/image-upload-field"
import { galleryImages, type GalleryImage } from "@/lib/data/gallery"
import { toast } from "sonner"
import { deleteGalleryImage, ensureGallerySeeded, saveGalleryImage } from "@/lib/admin/firestore-data"

export default function AdminGalleryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [images, setImages] = useState<GalleryImage[]>(galleryImages)
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [previewImage, setPreviewImage] = useState<GalleryImage | null>(null)
  const [uploadData, setUploadData] = useState({
    url: "",
    caption: "",
    category: "",
    eventId: "",
    projectId: "",
  })

  useEffect(() => {
    let active = true

    ;(async () => {
      const nextImages = await ensureGallerySeeded()
      if (active) setImages(nextImages)
    })()

    return () => {
      active = false
    }
  }, [])

  const categories = ["all", ...Array.from(new Set(images.map((img) => img.category)))]

  const filteredImages = images.filter((image) => {
    const caption = (image.caption ?? "").toString()
    const q = searchQuery ?? ""
    const matchesSearch = caption.toLowerCase().includes(q.toLowerCase())
    const matchesCategory = selectedCategory === "all" || image.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleSelectImage = (id: string) => {
    setSelectedImages((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleDeleteSelected = () => {
    if (confirm(`Are you sure you want to delete ${selectedImages.length} image(s)?`)) {
      ;(async () => {
        await Promise.all(selectedImages.map((id) => deleteGalleryImage(id)))
        setImages((prev) => prev.filter((img) => !selectedImages.includes(img.id)))
        toast.success("Images deleted.")
      })()
      setSelectedImages([])
    }
  }

  const handleDeleteSingle = (id: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      ;(async () => {
        await deleteGalleryImage(id)
        setImages((prev) => prev.filter((img) => img.id !== id))
        toast.success("Image deleted.")
      })()
    }
  }

  const handleUpload = async () => {
    if (!uploadData.url) return

    const nextImage: GalleryImage = {
      id: crypto.randomUUID(),
      url: uploadData.url,
      caption: uploadData.caption,
      eventId: uploadData.eventId || null,
      projectId: uploadData.projectId || null,
      category: uploadData.category || "Uncategorized",
    }

    try {
      await saveGalleryImage(nextImage)
      setImages((prev) => [nextImage, ...prev])
      setUploadData({ url: "", caption: "", category: "", eventId: "", projectId: "" })
      setShowUploadModal(false)
      toast.success("Image uploaded.")
    } catch {
      toast.error("Upload failed.")
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="Gallery" />

      <div className="flex-1 p-6 space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  {selectedCategory === "all" ? "All" : selectedCategory}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className="capitalize"
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2">
            {selectedImages.length > 0 && (
              <Button variant="destructive" onClick={handleDeleteSelected}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete ({selectedImages.length})
              </Button>
            )}
            <Button onClick={() => setShowUploadModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Upload Images
            </Button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              className={`
                relative group aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer
                ${selectedImages.includes(image.id) ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-muted"}
              `}
              onClick={() => toggleSelectImage(image.id)}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${image.url})` }}
              />
              
              {/* Selection indicator */}
              <div className={`
                absolute top-2 left-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                ${selectedImages.includes(image.id) 
                  ? "bg-primary border-primary text-primary-foreground" 
                  : "bg-background/80 border-muted-foreground/30 opacity-0 group-hover:opacity-100"
                }
              `}>
                {selectedImages.includes(image.id) && <CheckCircle className="h-4 w-4" />}
              </div>

              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation()
                    setPreviewImage(image)
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteSingle(image.id)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Category badge */}
              <div className="absolute bottom-2 left-2 right-2">
                <span className="inline-block px-2 py-1 bg-black/70 text-white text-xs rounded capitalize">
                  {image.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <ImagePlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No images found.</p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowUploadModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-lg sm:w-full bg-background rounded-xl shadow-2xl z-50 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Upload Images</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowUploadModal(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <ImageUploadField
                  label="Image"
                  value={uploadData.url}
                  onChange={(value) => setUploadData((prev) => ({ ...prev, url: value }))}
                  helperText="Upload a file or paste an image URL."
                />
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Caption</label>
                  <Textarea
                    value={uploadData.caption}
                    onChange={(e) => setUploadData((prev) => ({ ...prev, caption: e.target.value }))}
                    placeholder="Describe the image"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select
                    value={uploadData.category}
                    onValueChange={(value) => setUploadData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter((c) => c !== "all").map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Project ID</label>
                    <Input
                      value={uploadData.projectId}
                      onChange={(e) => setUploadData((prev) => ({ ...prev, projectId: e.target.value }))}
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Event ID</label>
                    <Input
                      value={uploadData.eventId}
                      onChange={(e) => setUploadData((prev) => ({ ...prev, eventId: e.target.value }))}
                      placeholder="Optional"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpload} disabled={!uploadData.url}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50"
              onClick={() => setPreviewImage(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-4 sm:inset-8 z-50 flex items-center justify-center"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-white hover:bg-white/20"
                onClick={() => setPreviewImage(null)}
              >
                <X className="h-6 w-6" />
              </Button>
              <img
                src={previewImage.url}
                alt={previewImage.caption || "Gallery image"}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <h3 className="text-white text-lg font-medium">{previewImage.caption || "Untitled"}</h3>
                {previewImage.category && (
                  <p className="text-white/70 text-sm mt-1 capitalize">{previewImage.category}</p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
