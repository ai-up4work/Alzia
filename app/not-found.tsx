"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search, Leaf, Sparkles, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

const floatingAnimation = {
  y: [0, -20, 0],
  rotate: [0, 5, -5, 0],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut"
  }
}

const leafAnimation = {
  y: [0, -15, 0],
  x: [0, 10, 0],
  rotate: [0, 10, -10, 0],
  transition: {
    duration: 8,
    repeat: Infinity,
    ease: "easeInOut"
  }
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
}

export default function NotFoundPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center px-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      
      {/* Floating leaf decorations */}
      <motion.div
        className="absolute top-32 left-1/4 text-secondary/20"
        animate={leafAnimation}
      >
        <Leaf className="w-24 h-24" />
      </motion.div>
      
      <motion.div
        className="absolute bottom-32 right-1/4 text-primary/20"
        animate={{
          ...leafAnimation,
          transition: { ...leafAnimation.transition, delay: 2 }
        }}
      >
        <Leaf className="w-32 h-32" />
      </motion.div>

      <motion.div
        className="absolute top-1/2 left-20 text-secondary/15"
        animate={{
          ...leafAnimation,
          transition: { ...leafAnimation.transition, delay: 4 }
        }}
      >
        <Sparkles className="w-20 h-20" />
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* 404 Number */}
          <motion.div
            variants={fadeInUp}
            className="relative"
          >
            <motion.div
              animate={floatingAnimation}
              className="inline-block"
            >
              <h1 className="font-serif text-[180px] md:text-[240px] lg:text-[300px] leading-none font-light text-primary/20 select-none">
                404
              </h1>
            </motion.div>
            
            {/* Decorative leaf on the "0" */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Leaf className="w-24 h-24 md:w-32 md:h-32 text-secondary/40" />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.div variants={fadeInUp} className="space-y-4">
            <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground">
              Page Not Found
            </h2>
            <div className="flex items-center justify-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5 text-secondary" />
              </motion.div>
              <p className="text-lg md:text-xl text-muted-foreground max-w-md">
                It seems this beauty product has gone out of stock in our digital shelves
              </p>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5 text-primary" />
              </motion.div>
            </div>
          </motion.div>

          {/* Description */}
          <motion.p 
            variants={fadeInUp}
            className="text-muted-foreground max-w-lg mx-auto"
          >
            Don't worry, we have plenty of other natural treasures waiting for you. 
            Let's get you back to discovering our collection.
          </motion.p>

          {/* Action buttons */}
          <motion.div 
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 h-12"
              >
                <Link href="/">
                  <Home className="w-5 h-5 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => router.back()}
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary/10 rounded-full px-8 h-12"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Go Back
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-secondary text-secondary hover:bg-secondary/10 rounded-full px-8 h-12"
              >
                <Link href="/shop">
                  <Search className="w-5 h-5 mr-2" />
                  Browse Products
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Popular links */}
          <motion.div
            variants={fadeInUp}
            className="pt-8 border-t border-border"
          >
            <p className="text-sm text-muted-foreground mb-4">Popular Destinations</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { label: "Skincare", href: "/shop/skincare" },
                { label: "Makeup", href: "/shop/makeup" },
                { label: "Fragrance", href: "/shop/fragrance" },
                { label: "Wholesale", href: "/wholesale" },
                { label: "About Us", href: "/about" },
              ].map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-muted hover:bg-primary/10 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Leaf className="w-3 h-3" />
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-40 right-40 w-64 h-64 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-40 left-40 w-72 h-72 bg-gradient-to-br from-secondary/30 to-primary/30 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  )
}
