import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your store settings</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Store Information */}
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
            <CardDescription>Basic information about your store</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input id="storeName" defaultValue="Belle Cosmetics" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeEmail">Contact Email</Label>
              <Input id="storeEmail" type="email" defaultValue="contact@bellecosmetics.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storePhone">Contact Phone</Label>
              <Input id="storePhone" defaultValue="+1 (555) 123-4567" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeAddress">Address</Label>
              <Textarea id="storeAddress" defaultValue="123 Beauty Lane, Paris, France" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Business Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Business Settings</CardTitle>
            <CardDescription>Configure your business preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Wholesale Orders</Label>
                <p className="text-sm text-muted-foreground">Enable wholesale pricing for B2B customers</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Guest Checkout</Label>
                <p className="text-sm text-muted-foreground">Allow customers to checkout without an account</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive email alerts for new orders</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Inventory Tracking</Label>
                <p className="text-sm text-muted-foreground">Track stock levels and get low stock alerts</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Tax Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Tax Settings</CardTitle>
            <CardDescription>Configure tax rates for your store</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
              <Input id="taxRate" type="number" defaultValue="10" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Include Tax in Prices</Label>
                <p className="text-sm text-muted-foreground">Display prices with tax included</p>
              </div>
              <Switch />
            </div>
            <Button>Save Tax Settings</Button>
          </CardContent>
        </Card>

        {/* Currency Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Currency & Locale</CardTitle>
            <CardDescription>Configure currency and regional settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" defaultValue="USD" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currencySymbol">Currency Symbol</Label>
              <Input id="currencySymbol" defaultValue="$" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" defaultValue="America/New_York" />
            </div>
            <Button>Save Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
