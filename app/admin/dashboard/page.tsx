import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch dashboard stats
  const [{ count: productsCount }, { count: ordersCount }, { count: customersCount }, { data: recentOrders }] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("customers").select("*", { count: "exact", head: true }),
      supabase
        .from("orders")
        .select("id, order_number, customer_name, total_amount, status, created_at")
        .order("created_at", { ascending: false })
        .limit(5),
    ])

  // Calculate total revenue
  const { data: revenueData } = await supabase.from("orders").select("total_amount").eq("payment_status", "paid")

  const totalRevenue = revenueData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

  const stats = [
    {
      name: "Total Products",
      value: productsCount || 0,
      icon: Package,
      change: "+12%",
      trend: "up",
      href: "/admin/products",
    },
    {
      name: "Total Orders",
      value: ordersCount || 0,
      icon: ShoppingCart,
      change: "+8%",
      trend: "up",
      href: "/admin/orders",
    },
    {
      name: "Total Customers",
      value: customersCount || 0,
      icon: Users,
      change: "+23%",
      trend: "up",
      href: "/admin/customers",
    },
    {
      name: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      change: "+15%",
      trend: "up",
      href: "/admin/reports",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700"
      case "shipped":
        return "bg-blue-100 text-blue-700"
      case "processing":
        return "bg-yellow-100 text-yellow-700"
      case "pending":
        return "bg-gray-100 text-gray-700"
      case "cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.name} href={stat.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.name}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="mt-1 flex items-center text-xs">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                  ) : (
                    <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                  )}
                  <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>{stat.change}</span>
                  <span className="ml-1 text-muted-foreground">from last month</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest orders from your store</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders && recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{order.order_number}</p>
                    <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.total_amount?.toFixed(2)}</p>
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No orders yet</p>
            )}
          </div>
          {recentOrders && recentOrders.length > 0 && (
            <div className="mt-4 text-center">
              <Link href="/admin/orders" className="text-sm font-medium text-primary hover:underline">
                View all orders
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
