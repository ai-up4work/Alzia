import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Download } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default async function AdminCustomersPage() {
  const supabase = await createClient()

  const { data: customers } = await supabase.from("customers").select("*").order("created_at", { ascending: false })

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "wholesale":
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Wholesale</Badge>
      case "retail":
        return <Badge variant="secondary">Retail</Badge>
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "blocked":
        return <Badge variant="destructive">Blocked</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage your customer base</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search customers..." className="pl-9" />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Customers ({customers?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Orders</th>
                  <th className="pb-3 font-medium">Total Spent</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Joined</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {customers && customers.length > 0 ? (
                  customers.map((customer) => (
                    <tr key={customer.id} className="text-sm">
                      <td className="py-4">
                        <div>
                          <p className="font-medium">
                            {customer.first_name} {customer.last_name}
                          </p>
                          <p className="text-muted-foreground">{customer.email}</p>
                        </div>
                      </td>
                      <td className="py-4">{getTypeBadge(customer.customer_type)}</td>
                      <td className="py-4">{customer.order_count || 0}</td>
                      <td className="py-4 font-medium">${(customer.total_spent || 0).toFixed(2)}</td>
                      <td className="py-4">{getStatusBadge(customer.status)}</td>
                      <td className="py-4 text-muted-foreground">
                        {new Date(customer.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        <Link href={`/admin/customers/${customer.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                      No customers yet
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
