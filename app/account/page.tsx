import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Package, Heart, MapPin, User, CreditCard, LogOut } from "lucide-react"

export default async function AccountPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const menuItems = [
    {
      icon: Package,
      label: "My Orders",
      href: "/account/orders",
      description: "Track and manage your orders",
    },
    {
      icon: Heart,
      label: "Wishlist",
      href: "/account/wishlist",
      description: "Products you have saved",
    },
    {
      icon: MapPin,
      label: "Addresses",
      href: "/account/addresses",
      description: "Manage delivery addresses",
    },
    {
      icon: User,
      label: "Profile",
      href: "/account/profile",
      description: "Update personal information",
    },
    {
      icon: CreditCard,
      label: "Payment Methods",
      href: "/account/payments",
      description: "Saved payment options",
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="font-serif text-4xl text-foreground font-light mb-2">My Account</h1>
            <p className="text-muted-foreground">
              Welcome back, {user.user_metadata?.first_name || user.email?.split("@")[0]}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-start gap-4 p-6 bg-card rounded-2xl border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">{item.label}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>

          <form action="/auth/signout" method="post" className="mt-8">
            <button
              type="submit"
              className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </main>
  )
}
