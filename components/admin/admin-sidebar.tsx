"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Truck,
  Tag,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  Store,
  Box,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Image from "next/image"

const navigationSections = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { name: "Reports", href: "/admin/reports", icon: BarChart3 },
    ]
  },
  {
    title: "Commerce",
    items: [
      { name: "Products", href: "/admin/products", icon: Package },
      { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
      { name: "Discounts", href: "/admin/discounts", icon: Tag },
    ]
  },
  {
    title: "Operations",
    items: [
      { name: "Deliveries", href: "/admin/deliveries", icon: Truck },
      { name: "Customers", href: "/admin/customers", icon: Users },
      { name: "Wholesale", href: "/admin/wholesale", icon: Store },
    ]
  },
  {
    title: "System",
    items: [
      { name: "Settings", href: "/admin/settings", icon: Settings },
    ]
  }
]

interface AdminSidebarProps {
  isRootAdmin?: boolean
}

export function AdminSidebar({ isRootAdmin = false }: AdminSidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden backdrop-blur-md bg-background/80 border border-border/50 rounded-2xl shadow-lg"
        onClick={() => setCollapsed(!collapsed)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-gradient-to-b from-background via-background to-primary/5 border-r border-border/50 backdrop-blur-xl transition-all duration-300 lg:relative",
          collapsed ? "-translate-x-full lg:translate-x-0 lg:w-20" : "w-60",
        )}
      >
        {/* Logo Section */}
        <div className="flex h-20 items-center justify-between border-b border-border/50 px-6 bg-background/50 backdrop-blur-sm">
          {!collapsed ? (
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="relative">
                {/* <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" /> */}
                <Image
                  src="/alzia-logo.png"
                  alt="Alzìa Logo"
                  width={100}
                  height={100}
                  className="relative rounded-2xl flex bg-transparent items-center justify-center object-contain"
                />
              </div>
              <div>
                {/* <h2 className="font-serif text-xl font-bold text-foreground tracking-wide">
                  Alzìa
                </h2> */}
              </div>
            </Link>
          ) : (
            <div className="relative mx-auto">
              {/* <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" /> */}
              <Image
                  src="/alzia-logo.png"
                  alt="Alzìa Logo"
                  width={100}
                  height={100}
                  className="relative rounded-2xl flex bg-transparent items-center justify-center object-contain"
                />
            </div>
            
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden lg:flex hover:bg-primary/10 rounded-xl" 
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform duration-300", collapsed && "rotate-180")} />
          </Button>
        </div>

        {/* <p className="text-xs text-muted-foreground font-medium">Admin Panel</p> */}

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-8 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          {navigationSections.map((section) => (
            <div key={section.title}>
              {!collapsed && (
                <h3 className="px-3 mb-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  // Hide admin-only items if not root admin

                  const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                          : "text-muted-foreground hover:text-secondary hover:bg-muted/50",
                        collapsed && "justify-center px-3"
                      )}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary rounded-2xl" />
                      )}
                      
                      {/* Icon */}
                      <item.icon className={cn(
                        "h-5 w-5 flex-shrink-0 relative z-10 transition-transform group-hover:scale-110",
                        isActive && "drop-shadow-sm"
                      )} />
                      
                      {/* Label */}
                      {!collapsed && (
                        <span className="relative z-10 font-medium tracking-wide">
                          {item.name}
                        </span>
                      )}

                      {/* Hover effect */}
                      {!isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Section */}
        <div className="border-t border-border/50 p-3 bg-background/50 backdrop-blur-sm">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-muted/50 group relative overflow-hidden",
              collapsed && "justify-center px-3"
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <LogOut className="h-5 w-5 flex-shrink-0 relative z-10 transition-transform group-hover:scale-110" />
            {!collapsed && (
              <span className="relative z-10 font-medium tracking-wide">Back to Store</span>
            )}
          </Link>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {!collapsed && (
        <div 
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity" 
          onClick={() => setCollapsed(true)} 
        />
      )}
    </>
  )
}