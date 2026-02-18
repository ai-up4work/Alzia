"use client"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  ImagePlus, X, Star, StarOff, GripVertical,
  Link as LinkIcon, Upload, AlertCircle, Loader2, CheckCircle2,
} from "lucide-react"

// ── Types ─────────────────────────────────────────────────────────────────────
type UploadStatus = "uploading" | "done" | "error"

type ImageEntry = {
  id:            string
  url:           string
  alt_text:      string
  display_order: number
  is_primary:    boolean
  previewError:  boolean
  status:        UploadStatus
  progress:      number        // 0–100
  filename:      string
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function uid() {
  return Math.random().toString(36).slice(2)
}

// Placeholder images cycled for mock uploads so the UI looks realistic
const PLACEHOLDER_IMAGES = [
  "https://placehold.co/400x400/e2e8f0/94a3b8?text=Product",
  "https://placehold.co/400x400/dbeafe/60a5fa?text=Product",
  "https://placehold.co/400x400/dcfce7/4ade80?text=Product",
  "https://placehold.co/400x400/fef9c3/facc15?text=Product",
  "https://placehold.co/400x400/fce7f3/f472b6?text=Product",
]
let placeholderIndex = 0
function nextPlaceholder() {
  return PLACEHOLDER_IMAGES[placeholderIndex++ % PLACEHOLDER_IMAGES.length]
}

// ── Component ─────────────────────────────────────────────────────────────────
export function ProductImageUploader() {
  const [images, setImages]           = useState<ImageEntry[]>([])
  const [urlInput, setUrlInput]       = useState("")
  const [urlError, setUrlError]       = useState("")
  const [isDraggingOver, setDragOver] = useState(false)
  const [dragIndex, setDragIndex]     = useState<number | null>(null)
  const fileInputRef                  = useRef<HTMLInputElement>(null)

  // ── Mock upload simulation ─────────────────────────────────────────────────
  const simulateUpload = useCallback((filename: string) => {
    const id          = uid()
    const placeholder = nextPlaceholder()

    // Add entry immediately in "uploading" state
    setImages((prev) => [
      ...prev,
      {
        id,
        url:           placeholder,
        alt_text:      filename.replace(/\.[^.]+$/, ""),
        display_order: prev.length,
        is_primary:    prev.length === 0,
        previewError:  false,
        status:        "uploading",
        progress:      0,
        filename,
      },
    ])

    // Simulate progress ticks
    const totalMs  = 1200 + Math.random() * 800   // 1.2–2s per file
    const interval = 80
    const steps    = totalMs / interval
    let   tick     = 0

    const timer = setInterval(() => {
      tick++
      const progress = Math.min(Math.round((tick / steps) * 100), 99)
      setImages((prev) =>
        prev.map((img) => img.id === id ? { ...img, progress } : img)
      )
      if (tick >= steps) {
        clearInterval(timer)
        // Mark done — in production swap `placeholder` with the real storage URL
        setImages((prev) =>
          prev.map((img) =>
            img.id === id ? { ...img, status: "done", progress: 100 } : img
          )
        )
      }
    }, interval)
  }, [])

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return
      simulateUpload(file.name)
    })
  }

  // ── URL add ────────────────────────────────────────────────────────────────
  const handleUrlAdd = () => {
    const trimmed = urlInput.trim()
    if (!trimmed) return
    try { new URL(trimmed) } catch {
      setUrlError("Please enter a valid URL")
      return
    }
    setUrlError("")
    setImages((prev) => [
      ...prev,
      {
        id:            uid(),
        url:           trimmed,
        alt_text:      "",
        display_order: prev.length,
        is_primary:    prev.length === 0,
        previewError:  false,
        status:        "done",
        progress:      100,
        filename:      trimmed,
      },
    ])
    setUrlInput("")
  }

  // ── Mutation helpers ───────────────────────────────────────────────────────
  const removeImage = (id: string) => {
    setImages((prev) => {
      const next = prev.filter((img) => img.id !== id)
      if (next.length > 0 && !next.some((img) => img.is_primary)) {
        next[0] = { ...next[0], is_primary: true }
      }
      return next.map((img, i) => ({ ...img, display_order: i }))
    })
  }

  const setPrimary = (id: string) => {
    setImages((prev) =>
      prev.map((img) => ({ ...img, is_primary: img.id === id }))
    )
  }

  const updateAlt = (id: string, value: string) => {
    setImages((prev) =>
      prev.map((img) => img.id === id ? { ...img, alt_text: value } : img)
    )
  }

  // ── Drag-to-reorder ────────────────────────────────────────────────────────
  const onDragStart = (index: number) => setDragIndex(index)
  const onDragEnter = (index: number) => {
    if (dragIndex === null || dragIndex === index) return
    setImages((prev) => {
      const next    = [...prev]
      const [moved] = next.splice(dragIndex, 1)
      next.splice(index, 0, moved)
      setDragIndex(index)
      return next.map((img, i) => ({ ...img, display_order: i }))
    })
  }
  const onDragEnd = () => setDragIndex(null)

  // ── Drop zone ──────────────────────────────────────────────────────────────
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  // ── Serialise for server action ────────────────────────────────────────────
  const imagesJson = JSON.stringify(
    images
      .filter((img) => img.status === "done")
      .map(({ url, alt_text, display_order, is_primary }) => ({
        url, alt_text, display_order, is_primary,
      }))
  )

  const uploadingCount = images.filter((img) => img.status === "uploading").length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImagePlus className="h-4 w-4" />
          Product Images
          {uploadingCount > 0 && (
            <Badge variant="secondary" className="ml-1 gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Uploading {uploadingCount}…
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Upload files or paste a URL. Drag ⠿ to reorder. ★ = primary image.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">

        {/* ── URL input ── */}
        <div className="space-y-2">
          <Label>Add by URL</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={urlInput}
                onChange={(e) => { setUrlInput(e.target.value); setUrlError("") }}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleUrlAdd())}
                placeholder="https://example.com/image.jpg"
                className="pl-9"
              />
            </div>
            <Button type="button" variant="outline" onClick={handleUrlAdd}>Add</Button>
          </div>
          {urlError && (
            <p className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3" />{urlError}
            </p>
          )}
        </div>

        {/* ── Drop zone ── */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed py-8 transition-colors ${
            isDraggingOver
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 bg-muted/30 hover:border-muted-foreground/50 hover:bg-muted/50"
          }`}
        >
          <Upload className="h-7 w-7 text-muted-foreground/50" />
          <div className="text-center">
            <p className="text-sm font-medium">Drop images here or click to browse</p>
            <p className="text-xs text-muted-foreground">PNG, JPG, WEBP — mock upload simulation</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {/* ── Image list ── */}
        {images.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Images ({images.length})</Label>
              <p className="text-xs text-muted-foreground">Drag to reorder</p>
            </div>

            <div className="space-y-2">
              {images.map((img, index) => (
                <div
                  key={img.id}
                  draggable={img.status === "done"}
                  onDragStart={() => onDragStart(index)}
                  onDragEnter={() => onDragEnter(index)}
                  onDragEnd={onDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  className={`flex items-start gap-3 rounded-lg border bg-card p-3 transition-all ${
                    dragIndex === index ? "opacity-50 scale-[0.98]" : ""
                  } ${img.is_primary && img.status === "done" ? "border-primary/40 bg-primary/5" : ""}`}
                >
                  {/* Drag handle */}
                  <div className={`mt-3 ${img.status === "done" ? "cursor-grab text-muted-foreground/40 hover:text-muted-foreground" : "text-muted-foreground/20 cursor-not-allowed"}`}>
                    <GripVertical className="h-4 w-4" />
                  </div>

                  {/* Thumbnail */}
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-muted">
                    {img.status === "uploading" ? (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-1">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/50" />
                        <span className="text-[10px] text-muted-foreground">{img.progress}%</span>
                      </div>
                    ) : img.previewError ? (
                      <div className="flex h-full w-full items-center justify-center">
                        <AlertCircle className="h-5 w-5 text-muted-foreground/40" />
                      </div>
                    ) : (
                      <Image
                        src={img.url}
                        alt={img.alt_text || "Product image"}
                        fill
                        className="object-cover"
                        unoptimized
                        onError={() =>
                          setImages((prev) =>
                            prev.map((i) => i.id === img.id ? { ...i, previewError: true } : i)
                          )
                        }
                      />
                    )}
                    {/* Primary overlay */}
                    {img.is_primary && img.status === "done" && (
                      <div className="absolute bottom-0 left-0 right-0 bg-primary/80 py-0.5 text-center">
                        <span className="text-[9px] font-bold uppercase tracking-wide text-primary-foreground">Primary</span>
                      </div>
                    )}
                  </div>

                  {/* Info + progress */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant="outline" className="text-xs font-mono shrink-0">
                        #{index + 1}
                      </Badge>
                      {img.status === "uploading" && (
                        <Badge variant="secondary" className="gap-1 text-xs">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Uploading…
                        </Badge>
                      )}
                      {img.status === "done" && img.is_primary && (
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                          Primary
                        </Badge>
                      )}
                      {img.status === "done" && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      )}
                    </div>

                    {/* Progress bar */}
                    {img.status === "uploading" && (
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-75"
                          style={{ width: `${img.progress}%` }}
                        />
                      </div>
                    )}

                    <Input
                      value={img.alt_text}
                      onChange={(e) => updateAlt(img.id, e.target.value)}
                      placeholder="Alt text (for accessibility)"
                      className="h-8 text-xs"
                      disabled={img.status === "uploading"}
                    />
                    <p className="text-xs text-muted-foreground truncate">
                      {img.status === "uploading"
                        ? `📁 ${img.filename}`
                        : img.url.startsWith("https://placehold.co")
                          ? `✓ Mock upload — ${img.filename}`
                          : img.url
                      }
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 flex-col gap-1.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      disabled={img.status === "uploading"}
                      onClick={() => setPrimary(img.id)}
                      title={img.is_primary ? "Primary image" : "Set as primary"}
                    >
                      {img.is_primary
                        ? <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        : <StarOff className="h-3.5 w-3.5 text-muted-foreground" />
                      }
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => removeImage(img.id)}
                      title="Remove"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {images.length === 0 && (
          <p className="text-center text-xs text-muted-foreground py-2">
            No images added yet.
          </p>
        )}

        {/* Hidden field — only sends completed uploads */}
        <input type="hidden" name="images_json" value={imagesJson} />
      </CardContent>
    </Card>
  )
}