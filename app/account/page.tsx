import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Package, Heart, MapPin, User, CreditCard, LogOut, Sparkles, ArrowRight, Wand2 } from "lucide-react"

import Image from "next/image"

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
      href: `/account/orders`,
      description: "Track and manage your orders",
    },
    {
      icon: Heart,
      label: "Wishlist",
      href: `/account/wishlist`,
      description: "Products you have saved",
    },
    {
      icon: MapPin,
      label: "Addresses",
      href: `/account/addresses`,
      description: "Manage delivery addresses",
    },
    {
      icon: User,
      label: "Profile",
      href: `/account/profile`,
      description: "Update personal information",
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

          {/* Virtual Try-On Feature Card */}
          <Link
            href="/account/virtual-tryon"
            className="group block mb-6 relative overflow-hidden rounded-2xl border border-purple-200/60 bg-gradient-to-br from-purple-50 via-pink-50/80 to-rose-50 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-500 hover:-translate-y-0.5"
          >
            {/* Decorative background orbs */}
            <div className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full bg-gradient-to-br from-purple-200/40 to-pink-200/40 blur-2xl group-hover:scale-125 transition-transform duration-700" />
            <div className="pointer-events-none absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-gradient-to-tr from-rose-200/30 to-purple-200/30 blur-2xl group-hover:scale-125 transition-transform duration-700" />

            <div className="relative flex items-center gap-6 p-6">
              {/* Icon area */}
              <div className="flex-shrink-0 relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-200 group-hover:shadow-purple-300 transition-shadow duration-300">
                  <Wand2 className="w-8 h-8 text-white" strokeWidth={1.5} />
                </div>
                {/* Sparkle badge */}
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 shadow-sm">
                  <Sparkles className="w-3 h-3 text-white" />
                </span>
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-widest text-purple-500">
                    AI-Powered
                  </span>
                  <span className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-purple-700 border border-purple-200/60">
                    New
                  </span>
                </div>
                <h3 className="font-serif text-xl font-light text-gray-900 mb-1 group-hover:text-purple-900 transition-colors">
                  Virtual Try-On
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  See how our garments look on you before you buy — upload a photo and let AI do the rest.
                </p>
              </div>

              {/* Arrow CTA */}
              <div className="flex-shrink-0 flex items-center gap-2 text-purple-600 font-medium text-sm">
                <span className="hidden sm:inline opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  Try now
                </span>
                <div className="w-9 h-9 rounded-full bg-white/80 border border-purple-200/60 flex items-center justify-center group-hover:bg-purple-600 group-hover:border-purple-600 transition-all duration-300 shadow-sm">
                  <ArrowRight className="w-4 h-4 text-purple-500 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" />
                </div>
              </div>
            </div>

            {/* Bottom strip with example thumbnails */}
            <div className="relative border-t border-purple-100/80 bg-white/40 backdrop-blur-sm px-6 py-3 flex items-center gap-3">
              <div className="flex -space-x-2">
                {[
                  "https://res.cloudinary.com/diwynktss/image/upload/v1771171272/Alzia/job-1771171269335/person.jpg",
                  "https://res.cloudinary.com/diwynktss/image/upload/v1771166285/Alzia/job-1771166282423/person.jpg",
                  "https://res.cloudinary.com/diwynktss/image/upload/v1771217591/Alzia/job-1771217590283/person.jpg",
                ].map((src, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-sm"
                    style={{ zIndex: 3 - i }}
                  >
                    <Image src={src} alt="" className="w-full h-full object-cover object-top" 
                    width={32} height={32} />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                <span className="font-medium text-gray-700">Thousands of try-ons</span> generated — yours is next
              </p>
            </div>
          </Link>

          {/* Account Menu Grid */}
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
        </div>
      </div>

      <Footer />
    </main>
  )
}