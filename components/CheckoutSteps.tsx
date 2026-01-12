"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, MapPin, CreditCard, Check, Sparkles } from "lucide-react"

interface CheckoutStepsProps {
  currentStep: number
  onStepClick: (step: number) => void
}

const steps = [
  { 
    number: 1, 
    label: "Contact", 
    icon: User,
    description: "Your details"
  },
  { 
    number: 2, 
    label: "Shipping", 
    icon: MapPin,
    description: "Delivery address"
  },
  { 
    number: 3, 
    label: "Payment", 
    icon: CreditCard,
    description: "Complete order"
  },
]

export function CheckoutSteps({ currentStep, onStepClick }: CheckoutStepsProps) {
  return (
    <div className="mb-12">
      {/* Desktop View - All steps visible with elegant design */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between relative">
          {/* Background connecting line */}
          <div className="absolute top-[30px] left-0 right-0 h-[2px] bg-gradient-to-r from-border via-border to-border -z-10">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary"
              initial={{ width: "0%" }}
              animate={{ 
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` 
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          </div>

          {steps.map((step, index) => {
            const Icon = step.icon
            const isCompleted = step.number < currentStep
            const isCurrent = step.number === currentStep
            const isUpcoming = step.number > currentStep

            return (
              <motion.button
                key={step.number}
                onClick={() => {
                  if (step.number <= currentStep) {
                    onStepClick(step.number)
                  }
                }}
                disabled={isUpcoming}
                className={`flex flex-col items-center gap-3 relative group ${
                  isUpcoming ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                whileHover={!isUpcoming ? { scale: 1.05 } : {}}
                whileTap={!isUpcoming ? { scale: 0.98 } : {}}
              >
                {/* Step circle with icon */}
                <div className="relative">
                  <motion.div
                    className={`w-[60px] h-[60px] rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-300 ${
                      isCompleted
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                        : isCurrent
                          ? "bg-primary text-primary-foreground shadow-xl shadow-primary/40"
                          : "bg-muted text-muted-foreground"
                    }`}
                    initial={false}
                    animate={
                      isCurrent
                        ? {
                            boxShadow: [
                              "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
                              "0 15px 35px -5px rgba(0, 0, 0, 0.3)",
                              "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
                            ],
                          }
                        : {}
                    }
                    transition={{
                      duration: 2,
                      repeat: isCurrent ? Infinity : 0,
                      ease: "easeInOut",
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {isCompleted ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        >
                          <Check className="w-6 h-6" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="icon"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        >
                          <Icon className="w-6 h-6" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Shimmer effect for current step */}
                    {isCurrent && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{
                          x: ["-100%", "100%"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    )}
                  </motion.div>

                  {/* Outer ring animation for current step */}
                  {isCurrent && (
                    <>
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-primary"
                        initial={{ scale: 1, opacity: 1 }}
                        animate={{ scale: 1.4, opacity: 0 }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeOut",
                        }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-primary"
                        initial={{ scale: 1, opacity: 1 }}
                        animate={{ scale: 1.6, opacity: 0 }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeOut",
                          delay: 0.5,
                        }}
                      />
                    </>
                  )}

                  {/* Sparkle effect for completed steps */}
                  {isCompleted && (
                    <motion.div
                      className="absolute -top-1 -right-1"
                      initial={{ scale: 0, rotate: 0 }}
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Sparkles className="w-4 h-4 text-primary fill-primary" />
                    </motion.div>
                  )}
                </div>

                {/* Step label and description */}
                <div className="text-center space-y-0.5">
                  <motion.p
                    className={`text-sm font-medium transition-colors ${
                      isCompleted || isCurrent
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                    animate={
                      isCurrent
                        ? {
                            scale: [1, 1.05, 1],
                          }
                        : {}
                    }
                    transition={{
                      duration: 2,
                      repeat: isCurrent ? Infinity : 0,
                      ease: "easeInOut",
                    }}
                  >
                    {step.label}
                  </motion.p>
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                </div>

                {/* Hover glow effect */}
                {!isUpcoming && (
                  <motion.div
                    className="absolute inset-0 -z-10 rounded-full bg-primary/10 blur-xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Mobile View - Elegant single step display */}
      <div className="md:hidden space-y-6">
        {/* Decorative top border with gradient */}
        <div className="relative h-1 bg-gradient-to-r from-transparent via-border to-transparent rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-primary/80 to-primary"
            initial={{ width: "0%" }}
            animate={{ width: `${(currentStep / steps.length) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>

        {/* Current step display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center gap-4"
          >
            {/* Main step icon */}
            <div className="relative">
              <motion.div
                className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center shadow-2xl shadow-primary/40"
                animate={{
                  boxShadow: [
                    "0 20px 40px -10px rgba(0, 0, 0, 0.2)",
                    "0 25px 50px -10px rgba(0, 0, 0, 0.3)",
                    "0 20px 40px -10px rgba(0, 0, 0, 0.2)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {React.createElement(steps[currentStep - 1].icon, {
                    className: "w-9 h-9",
                  })}
                </motion.div>

                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </motion.div>

              {/* Outer rings */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary/30"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary/20"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 0.5,
                }}
              />

              {/* Floating sparkles */}
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{
                  y: [-5, 5, -5],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="w-5 h-5 text-primary fill-primary" />
              </motion.div>
            </div>

            {/* Step info */}
            <div className="text-center space-y-1">
              <motion.h3
                className="text-xl font-serif text-foreground"
                animate={{
                  opacity: [0.9, 1, 0.9],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {steps[currentStep - 1].label}
              </motion.h3>
              <p className="text-sm text-muted-foreground">
                {steps[currentStep - 1].description}
              </p>
              <p className="text-xs text-muted-foreground/70 font-medium">
                Step {currentStep} of {steps.length}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Step dots navigation */}
        <div className="flex items-center justify-center gap-3">
          {steps.map((step) => {
            const isCompleted = step.number < currentStep
            const isCurrent = step.number === currentStep

            return (
              <motion.button
                key={step.number}
                onClick={() => {
                  if (step.number <= currentStep) {
                    onStepClick(step.number)
                  }
                }}
                disabled={step.number > currentStep}
                className="relative"
                whileTap={step.number <= currentStep ? { scale: 0.9 } : {}}
              >
                <motion.div
                  className={`rounded-full transition-all ${
                    isCompleted
                      ? "bg-primary w-3 h-3"
                      : isCurrent
                        ? "bg-primary w-4 h-4"
                        : "bg-muted w-2.5 h-2.5"
                  }`}
                  animate={
                    isCurrent
                      ? {
                          scale: [1, 1.2, 1],
                        }
                      : {}
                  }
                  transition={{
                    duration: 1.5,
                    repeat: isCurrent ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                />
                
                {/* Glow effect for current dot */}
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary"
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}