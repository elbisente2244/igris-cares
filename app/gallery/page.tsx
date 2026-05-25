"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { galleryImages, galleryCategories, type GalleryImage } from "@/lib/data/gallery"
import { loadPublicGalleryImages } from "@/lib/public-data"

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [galleryList, setGalleryList] = useState<GalleryImage[]>(galleryImages)

  useEffect(() => {
    let active = true
    ;(async () => {
      const nextImages = await loadPublicGalleryImages()
      if (active) setGalleryList(nextImages)
    })()
    return () => {
      active = false
    }
  }, [])

  const filteredImages = useMemo(() => {
    if (selectedCategory === "All") return galleryList
    return galleryList.filter((img) => img.category === selectedCategory)
  }, [galleryList, selectedCategory])

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
    document.body.style.overflow = "hidden"
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = "auto"
  }

  const goToPrevious = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? filteredImages.length - 1 : prev - 1
    )
  }

  const goToNext = () => {
    setCurrentImageIndex((prev) =>
      prev === filteredImages.length - 1 ? 0 : prev + 1
    )
  }

  const currentImage = filteredImages[currentImageIndex]

  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-secondary py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                Our Impact in Photos
              </span>
              <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-foreground tracking-tight text-balance">
                Gallery of Change
              </h1>
              <p className="mt-4 text-lg text-muted-foreground text-pretty">
                Explore moments captured from our projects and events. Every image tells a story of transformation and hope.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 border-b border-border bg-background sticky top-16 z-40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {galleryCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-16 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-muted-foreground mb-8">
              Showing {filteredImages.length} photo{filteredImages.length !== 1 ? "s" : ""}
            </p>

            {/* Masonry Grid */}
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="break-inside-avoid mb-4"
                >
                  <button
                    onClick={() => openLightbox(index)}
                    className="block w-full group relative rounded-xl overflow-hidden bg-secondary"
                  >
                    <img
                      src={image.url}
                      alt={image.caption}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-background text-sm font-medium">
                        {image.caption}
                      </p>
                      <span className="text-background/70 text-xs">
                        {image.category}
                      </span>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && currentImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors z-50"
            >
              <X className="h-5 w-5 text-background" />
            </button>

            {/* Navigation */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
              className="absolute left-4 h-12 w-12 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors z-50"
            >
              <ChevronLeft className="h-6 w-6 text-background" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              className="absolute right-4 h-12 w-12 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors z-50"
            >
              <ChevronRight className="h-6 w-6 text-background" />
            </button>

            {/* Image */}
            <motion.div
              key={currentImage.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="max-w-5xl max-h-[80vh] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={currentImage.url}
                alt={currentImage.caption}
                className="max-w-full max-h-[70vh] object-contain rounded-lg bg-secondary"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="mt-4 text-center">
                <p className="text-background text-lg font-medium">
                  {currentImage.caption}
                </p>
                <p className="text-background/60 text-sm mt-1">
                  {currentImage.category} | {currentImageIndex + 1} of {filteredImages.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  )
}
