"use client"

import { useState } from "react"
import { Share2, Facebook, Twitter, Linkedin, MessageCircle, Mail, Link2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ProductShareButtonProps {
  product: {
    name: string
    slug: string
    short_description?: string
    description?: string
    images?: { image_url: string; is_primary: boolean }[]
  }
  className?: string
  showText?: boolean
}

export function ProductShareButton({ product, className = "", showText = true }: ProductShareButtonProps) {
  const [copied, setCopied] = useState(false)

  // Get the current URL
  const productUrl = typeof window !== "undefined" ? window.location.href : ""
  
  // Get the primary image for OG sharing
  const primaryImage = product.images?.find(img => img.is_primary)?.image_url || product.images?.[0]?.image_url
  const imageUrl = primaryImage ? `${typeof window !== "undefined" ? window.location.origin : ""}${primaryImage}` : ""

  // Share message
  const shareMessage = `Check out ${product.name} - ${product.short_description || product.description?.slice(0, 100) || ""}`
  const encodedMessage = encodeURIComponent(shareMessage)
  const encodedUrl = encodeURIComponent(productUrl)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedMessage}%20${encodedUrl}`,
    email: `mailto:?subject=${encodeURIComponent(product.name)}&body=${encodedMessage}%0A%0A${encodedUrl}`,
  }

  const handleShare = async (platform: keyof typeof shareLinks) => {
    // Try native share API first (mobile)
    if (platform === "native" && navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: shareMessage,
          url: productUrl,
        })
        return
      } catch (err) {
        console.log("Native share cancelled or failed")
      }
    }

    // Fallback to opening share URLs
    if (platform !== "native") {
      window.open(shareLinks[platform], "_blank", "width=600,height=400")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className={`gap-2 ${className}`}
        >
          <Share2 className="w-4 h-4" />
          {showText && "Share"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm font-semibold">Share this product</div>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => handleShare("facebook")} className="cursor-pointer">
          <Facebook className="w-4 h-4 mr-2 text-blue-600" />
          <span>Share on Facebook</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleShare("twitter")} className="cursor-pointer">
          <Twitter className="w-4 h-4 mr-2 text-sky-500" />
          <span>Share on Twitter</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleShare("linkedin")} className="cursor-pointer">
          <Linkedin className="w-4 h-4 mr-2 text-blue-700" />
          <span>Share on LinkedIn</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleShare("whatsapp")} className="cursor-pointer">
          <MessageCircle className="w-4 h-4 mr-2 text-green-600" />
          <span>Share on WhatsApp</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleShare("email")} className="cursor-pointer">
          <Mail className="w-4 h-4 mr-2 text-gray-600" />
          <span>Share via Email</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2 text-green-600" />
              <span className="text-green-600">Link Copied!</span>
            </>
          ) : (
            <>
              <Link2 className="w-4 h-4 mr-2" />
              <span>Copy Link</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}