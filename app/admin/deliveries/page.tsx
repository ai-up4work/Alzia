import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default async function AdminDeliveriesPage() {
  const supabase = await createClient()

  const { data: zones } = await supabase.from("delivery_zones").select("*").order("name", { ascending: true })

  // Get orders that are ready for delivery
  const { data: pendingDeliveries } = await supabase
    .from("orders")
    .select("*")
    .in("status", ["processing", "shipped"])
    .order("created_at", { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Deliveries</h1>
          <p className="text-muted-foreground">Manage delivery zones and track shipments</p>
        </div>
        <Link href="/admin/deliveries/zones/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Delivery Zone
          </Button>
        </Link>
      </div>

      {/* Pending Deliveries */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Deliveries ({pendingDeliveries?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="pb-3 font-medium">Order</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Address</th>
                  <th className="pb-3 font-medium">Delivery Date</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pendingDeliveries && pendingDeliveries.length > 0 ? (
                  pendingDeliveries.map((order) => (
                    <tr key={order.id} className="text-sm">
                      <td className="py-4 font-medium">{order.order_number}</td>
                      <td className="py-4">{order.customer_name}</td>
                      <td className="py-4 max-w-xs truncate text-muted-foreground">
                        {order.shipping_address?.address_line_1}, {order.shipping_address?.city}
                      </td>
                      <td className="py-4">
                        {order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : "Not scheduled"}
                      </td>
                      <td className="py-4">
                        <Badge
                          className={
                            order.status === "shipped"
                              ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                              : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                          }
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No pending deliveries
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Zones */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Zones ({zones?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {zones && zones.length > 0 ? (
              zones.map((zone) => (
                <Card key={zone.id} className="border">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{zone.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {zone.estimated_days} day{zone.estimated_days > 1 ? "s" : ""} delivery
                        </p>
                      </div>
                      {zone.is_active ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </div>
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Delivery Charge:</span>
                        <span className="font-medium">${zone.delivery_charge?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Free Delivery Over:</span>
                        <span className="font-medium">
                          {zone.free_delivery_threshold ? `$${zone.free_delivery_threshold?.toFixed(2)}` : "N/A"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground py-8">No delivery zones configured</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
