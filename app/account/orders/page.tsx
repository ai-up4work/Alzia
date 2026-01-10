import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ChevronLeft, Package } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function OrdersPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch orders from database
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Account
          </Link>

          <h1 className="font-serif text-4xl text-foreground font-light mb-8">My Orders</h1>

          {!orders || orders.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-2xl border border-border/50">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-serif text-xl text-foreground mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
              <Button asChild className="rounded-full">
                <Link href="/shop">Shop Now</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-card rounded-2xl border border-border/50 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Order #{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-primary/10 text-primary"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 0,
                      }).format(order.total_amount)}
                    </p>
                    <Button asChild variant="outline" size="sm" className="rounded-full bg-transparent">
                      <Link href={`/account/orders/${order.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
