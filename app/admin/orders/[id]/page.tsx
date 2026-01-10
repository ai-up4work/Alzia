import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Printer, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { OrderStatusUpdate } from "@/components/admin/order-status-update"

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order } = await supabase.from("orders").select("*").eq("id", id).single()

  if (!order) {
    notFound()
  }

  const { data: orderItems } = await supabase.from("order_items").select("*").eq("order_id", id)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Delivered</Badge>
      case "shipped":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Shipped</Badge>
      case "processing":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Processing</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Paid</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      case "refunded":
        return <Badge variant="outline">Refunded</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-bold">Order {order.order_number}</h1>
            <p className="text-muted-foreground">
              Placed on {new Date(order.created_at).toLocaleDateString()} at{" "}
              {new Date(order.created_at).toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="mr-2 h-4 w-4" />
            Email Customer
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Items */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderItems?.map((item) => (
                <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={item.product_image || "/cosmetic-product.png"}
                      alt={item.product_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-muted-foreground">SKU: {item.product_sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${item.total_price?.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      ${item.unit_price?.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div className="mt-6 space-y-2 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${order.subtotal?.toFixed(2)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Discount {order.coupon_code && `(${order.coupon_code})`}
                  </span>
                  <span className="text-green-600">-${order.discount_amount?.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery</span>
                <span>{order.delivery_charge > 0 ? `$${order.delivery_charge?.toFixed(2)}` : "Free"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>${order.tax_amount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-lg font-bold">
                <span>Total</span>
                <span>${order.total_amount?.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Details Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Order Status</span>
                {getStatusBadge(order.status)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Payment</span>
                {getPaymentBadge(order.payment_status)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="capitalize">{order.payment_method || "N/A"}</span>
              </div>
              <OrderStatusUpdate orderId={order.id} currentStatus={order.status} />
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium">{order.customer_name}</p>
                <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              {order.shipping_address ? (
                <div className="text-sm">
                  <p className="font-medium">{order.shipping_address.full_name}</p>
                  <p className="text-muted-foreground">{order.shipping_address.address_line_1}</p>
                  {order.shipping_address.address_line_2 && (
                    <p className="text-muted-foreground">{order.shipping_address.address_line_2}</p>
                  )}
                  <p className="text-muted-foreground">
                    {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.pin_code}
                  </p>
                  <p className="text-muted-foreground">{order.shipping_address.phone}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">No shipping address</p>
              )}
            </CardContent>
          </Card>

          {/* Delivery Info */}
          {order.delivery_date && (
            <Card>
              <CardHeader>
                <CardTitle>Delivery</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span>{new Date(order.delivery_date).toLocaleDateString()}</span>
                </div>
                {order.delivery_slot && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Slot</span>
                    <span>{order.delivery_slot}</span>
                  </div>
                )}
                {order.delivery_instructions && (
                  <div className="pt-2">
                    <p className="text-muted-foreground">Instructions:</p>
                    <p>{order.delivery_instructions}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
