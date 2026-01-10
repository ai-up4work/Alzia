import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, Mail } from "lucide-react"

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>
}) {
  const { order } = await searchParams
  const orderNumber = order || "LUMXXXXXXX"

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-32 pb-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="font-serif text-4xl md:text-5xl text-foreground font-light mb-4">Thank You!</h1>
          <p className="text-xl text-muted-foreground mb-8">Your order has been successfully placed</p>

          <div className="bg-card rounded-2xl border border-border/50 p-8 mb-8">
            <p className="text-sm text-muted-foreground mb-2">Order Number</p>
            <p className="font-serif text-2xl text-foreground mb-6">{orderNumber}</p>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
              <div className="flex items-center gap-3 justify-center">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Confirmation sent to email</span>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <Package className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Estimated delivery: 3-5 days</span>
              </div>
            </div>
          </div>

          <p className="text-muted-foreground mb-8">
            We have sent a confirmation email with your order details. You can track your order status in your account.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/account/orders">Track Order</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full bg-transparent">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
