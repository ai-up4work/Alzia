"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export function DeleteProductButton({ productName }: { productName: string }) {
  return (
    <Button
      type="submit"
      variant="destructive"
      size="sm"
      className="gap-2"
      onClick={(e) => {
        if (!confirm(`Delete "${productName}"? This cannot be undone.`)) {
          e.preventDefault()
        }
      }}
    >
      <Trash2 className="h-4 w-4" />
      Delete Product
    </Button>
  )
}