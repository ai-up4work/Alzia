import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="font-serif text-3xl text-foreground font-medium">
          Lumière
        </Link>

        <div className="mt-12 bg-card rounded-2xl border border-border/50 p-8 shadow-sm">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-primary" />
          </div>

          <h1 className="font-serif text-2xl text-foreground mb-4">Check Your Email</h1>
          <p className="text-muted-foreground mb-8">
            We have sent a confirmation link to your email address. Please click the link to verify your account.
          </p>

          <Button asChild variant="outline" className="rounded-full bg-transparent">
            <Link href="/auth/login">Back to Sign In</Link>
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Did not receive the email? <button className="text-primary hover:underline">Resend</button>
        </p>
      </div>
    </main>
  )
}
