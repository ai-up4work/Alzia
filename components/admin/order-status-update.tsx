"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const ORDER_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
]

export function OrderStatusUpdate({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleUpdate = async () => {
    if (status === currentStatus) return

    setIsUpdating(true)
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", orderId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Failed to update order status:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-3 pt-4 border-t">
      <label className="text-sm font-medium">Update Status</label>
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ORDER_STATUSES.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={handleUpdate} disabled={isUpdating || status === currentStatus} className="w-full">
        {isUpdating ? "Updating..." : "Update Status"}
      </Button>
    </div>
  )
}
