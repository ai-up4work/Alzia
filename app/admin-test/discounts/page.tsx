import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default async function AdminDiscountsPage() {
  const supabase = await createClient()

  const { data: discounts } = await supabase.from("discounts").select("*").order("created_at", { ascending: false })

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "percentage":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Percentage</Badge>
      case "fixed":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Fixed Amount</Badge>
      case "free_shipping":
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Free Shipping</Badge>
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Discounts</h1>
          <p className="text-muted-foreground">Manage promotional codes and discounts</p>
        </div>
        <Link href="/admin/discounts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Discount
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search discount codes..." className="pl-9" />
          </div>
        </CardContent>
      </Card>

      {/* Discounts Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Discounts ({discounts?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="pb-3 font-medium">Code</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Value</th>
                  <th className="pb-3 font-medium">Usage</th>
                  <th className="pb-3 font-medium">Valid Until</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {discounts && discounts.length > 0 ? (
                  discounts.map((discount) => (
                    <tr key={discount.id} className="text-sm">
                      <td className="py-4">
                        <div>
                          <p className="font-mono font-medium">{discount.code}</p>
                          <p className="text-muted-foreground">{discount.name}</p>
                        </div>
                      </td>
                      <td className="py-4">{getTypeBadge(discount.discount_type)}</td>
                      <td className="py-4 font-medium">
                        {discount.discount_type === "percentage"
                          ? `${discount.discount_value}%`
                          : `$${discount.discount_value}`}
                      </td>
                      <td className="py-4">
                        {discount.usage_count || 0} / {discount.usage_limit || "∞"}
                      </td>
                      <td className="py-4 text-muted-foreground">
                        {discount.end_date ? new Date(discount.end_date).toLocaleDateString() : "No expiry"}
                      </td>
                      <td className="py-4">
                        {discount.is_active ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </td>
                      <td className="py-4">
                        <Link href={`/admin/discounts/${discount.id}`}>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                      No discounts created yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
