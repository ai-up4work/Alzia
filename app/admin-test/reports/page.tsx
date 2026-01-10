import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, Users } from "lucide-react"

export default async function AdminReportsPage() {
  const supabase = await createClient()

  // Fetch all orders for reporting
  const { data: orders } = await supabase.from("orders").select("*")

  // Calculate metrics
  const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
  const paidOrders = orders?.filter((o) => o.payment_status === "paid") || []
  const paidRevenue = paidOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0)

  const totalOrders = orders?.length || 0
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  // Get customer count
  const { count: customerCount } = await supabase.from("customers").select("*", { count: "exact", head: true })

  // Get product count
  const { count: productCount } = await supabase.from("products").select("*", { count: "exact", head: true })

  // Get low stock products
  const { data: lowStockProducts } = await supabase
    .from("products")
    .select("name, stock_quantity, low_stock_threshold")
    .lt("stock_quantity", 10)
    .order("stock_quantity", { ascending: true })
    .limit(5)

  // Get top selling products (simplified - based on order items)
  const { data: topProducts } = await supabase
    .from("order_items")
    .select("product_name, quantity")
    .order("quantity", { ascending: false })
    .limit(5)

  // Order status breakdown
  const statusCounts = orders?.reduce(
    (acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Analytics and business insights</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <div className="mt-1 flex items-center text-xs text-green-500">
              <TrendingUp className="mr-1 h-3 w-3" />
              <span>+12.5% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <div className="mt-1 flex items-center text-xs text-green-500">
              <TrendingUp className="mr-1 h-3 w-3" />
              <span>+8.2% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Order Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</div>
            <div className="mt-1 flex items-center text-xs text-red-500">
              <TrendingDown className="mr-1 h-3 w-3" />
              <span>-2.1% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerCount || 0}</div>
            <div className="mt-1 flex items-center text-xs text-green-500">
              <TrendingUp className="mr-1 h-3 w-3" />
              <span>+15.3% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Order Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status Breakdown</CardTitle>
            <CardDescription>Distribution of orders by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statusCounts && Object.entries(statusCounts).length > 0 ? (
                Object.entries(statusCounts).map(([status, count]) => {
                  const percentage = totalOrders > 0 ? (count / totalOrders) * 100 : 0
                  return (
                    <div key={status} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="capitalize">{status}</span>
                        <span className="font-medium">
                          {count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-primary" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="text-center text-muted-foreground py-4">No order data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alert</CardTitle>
            <CardDescription>Products that need restocking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts && lowStockProducts.length > 0 ? (
                lowStockProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
                        <Package className="h-4 w-4 text-red-600" />
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                    <span className="text-sm font-medium text-red-600">{product.stock_quantity} left</span>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">All products are well stocked</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Best performers this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts && topProducts.length > 0 ? (
                topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {index + 1}
                      </span>
                      <span className="font-medium">{product.product_name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{product.quantity} sold</span>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">No sales data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Summary</CardTitle>
            <CardDescription>Financial overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <span className="text-muted-foreground">Gross Revenue</span>
                <span className="font-medium">${totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between border-b pb-4">
                <span className="text-muted-foreground">Paid Orders Revenue</span>
                <span className="font-medium">${paidRevenue.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between border-b pb-4">
                <span className="text-muted-foreground">Pending Payments</span>
                <span className="font-medium">${(totalRevenue - paidRevenue).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="font-medium">Total Products</span>
                <span className="font-bold">{productCount || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
