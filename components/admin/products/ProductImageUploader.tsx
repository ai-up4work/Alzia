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
  progress:      number
  filename:      string
}

export type InitialImage = {
  id:            string
  url:           string
  alt_text:      string
  display_order: number
  is_primary:    boolean
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function uid() {
  return Math.random().toString(36).slice(2)
}

const CLOUD_NAME    = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!

async function uploadToCloudinary(
  file: File,
  productId: string,
  onProgress: (pct: number) => void
): Promise<string> {
  const fd = new FormData()
  fd.append("file", file)
  fd.append("upload_preset", UPLOAD_PRESET)
  fd.append("folder", `Alzia/products/${productId}`)

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`)

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 95))
    }

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText).secure_url)
      } else {
        reject(new Error(JSON.parse(xhr.responseText)?.error?.message ?? "Upload failed"))
      }
    }

    xhr.onerror = () => reject(new Error("Network error"))
    xhr.send(fd)
  })
}

// ── Component ─────────────────────────────────────────────────────────────────
export function ProductImageUploader({
  initialImages = [],
  productId,
}: {
  initialImages?: InitialImage[]
  productId?: string
}) {
  const [images, setImages] = useState<ImageEntry[]>(
    initialImages.map((img) => ({
      id:            img.id,
      url:           img.url,
      alt_text:      img.alt_text,
      display_order: img.display_order,
      is_primary:    img.is_primary,
      previewError:  false,
      status:        "done" as const,
      progress:      100,
      filename:      img.url,
    }))
  )
  const [urlInput, setUrlInput]       = useState("")
  const [urlError, setUrlError]       = useState("")
  const [isDraggingOver, setDragOver] = useState(false)
  const [dragIndex, setDragIndex]     = useState<number | null>(null)
  const fileInputRef                  = useRef<HTMLInputElement>(null)

  // ── Cloudinary upload ──────────────────────────────────────────────────────
  const handleUpload = useCallback(async (file: File) => {
    const id           = uid()
    const localPreview = URL.createObjectURL(file)

    setImages((prev) => [
      ...prev,
      {
        id,
        url:           localPreview,
        alt_text:      file.name.replace(/\.[^.]+$/, ""),
        display_order: prev.length,
        is_primary:    prev.length === 0,
        previewError:  false,
        status:        "uploading",
        progress:      0,
        filename:      file.name,
      },
    ])

    try {
      const folder = productId ?? "new"
      const url    = await uploadToCloudinary(file, folder, (pct) => {
        setImages((prev) =>
          prev.map((img) => img.id === id ? { ...img, progress: pct } : img)
        )
      })

      URL.revokeObjectURL(localPreview)
      setImages((prev) =>
        prev.map((img) =>
          img.id === id ? { ...img, url, status: "done", progress: 100 } : img
        )
      )
    } catch (err) {
      console.error("Cloudinary upload error:", err)
      setImages((prev) =>
        prev.map((img) =>
          img.id === id ? { ...img, status: "error", progress: 0 } : img
        )
      )
    }
  }, [productId])

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return
      handleUpload(file)
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

  const retryUpload = (id: string) => {
    // Find original file — can't retry without it, so just remove and re-add
    removeImage(id)
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
  const errorCount     = images.filter((img) => img.status === "error").length

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
          {errorCount > 0 && (
            <Badge variant="destructive" className="ml-1">
              {errorCount} failed
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
            <p className="text-xs text-muted-foreground">PNG, JPG, WEBP — uploads to Cloudinary</p>
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
                  } ${img.is_primary && img.status === "done" ? "border-primary/40 bg-primary/5" : ""}
                  ${img.status === "error" ? "border-destructive/40 bg-destructive/5" : ""}`}
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
                    ) : img.status === "error" ? (
                      <div className="flex h-full w-full items-center justify-center bg-destructive/10">
                        <AlertCircle className="h-5 w-5 text-destructive/60" />
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
                      {img.status === "error" && (
                        <Badge variant="destructive" className="text-xs">
                          Upload failed
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

                    {img.status === "uploading" && (
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-75"
                          style={{ width: `${img.progress}%` }}
                        />
                      </div>
                    )}

                    {img.status === "error" && (
                      <p className="text-xs text-destructive">
                        Failed to upload — remove and try again.
                      </p>
                    )}

                    {img.status !== "error" && (
                      <Input
                        value={img.alt_text}
                        onChange={(e) => updateAlt(img.id, e.target.value)}
                        placeholder="Alt text (for accessibility)"
                        className="h-8 text-xs"
                        disabled={img.status === "uploading"}
                      />
                    )}

                    <p className="text-xs text-muted-foreground truncate">
                      {img.status === "uploading"
                        ? `📁 ${img.filename}`
                        : img.status === "error"
                          ? `❌ ${img.filename}`
                          : img.url.includes("cloudinary.com")
                            ? `☁️ ${img.filename}`
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
                      disabled={img.status !== "done"}
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