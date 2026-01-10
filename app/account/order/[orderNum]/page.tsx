import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default async function OrderPage({
  params,
}: {
  params: Promise<{ orderNum: string }>
}) {
  const { orderNum } = await params   // ✅ REQUIRED

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-32 pb-24">
        <div className="max-w-2xl mx-auto px-6">
          <h1 className="font-serif text-3xl mb-4">Order Details</h1>

          <div className="rounded-xl border p-6">
            <p className="text-sm text-muted-foreground mb-2">Order Number</p>
            <p className="text-xl font-medium">{orderNum}</p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
