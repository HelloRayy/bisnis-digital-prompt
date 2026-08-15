import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { ArrowUpRight01Icon } from "hugeicons-react"
import { motion } from "framer-motion"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 disabled:pointer-events-none disabled:opacity-50 active:not-aria-[haspopup]:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary: KUMO UI Black Obsidian with Top Light Flare on Hover
        primary:
          "relative overflow-hidden bg-gradient-to-b from-zinc-800 to-zinc-950 text-white border border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22),0_2px_4px_0_rgba(0,0,0,0.4)] hover:from-zinc-600 hover:via-zinc-850 hover:to-zinc-950 hover:border-white/30 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),inset_0_12px_16px_-6px_rgba(255,255,255,0.18),0_6px_16px_0_rgba(0,0,0,0.5)] active:scale-95 font-bold transition-all duration-200 cursor-pointer",
        default:
          "relative overflow-hidden bg-gradient-to-b from-zinc-800 to-zinc-950 text-white border border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22),0_2px_4px_0_rgba(0,0,0,0.4)] hover:from-zinc-600 hover:via-zinc-850 hover:to-zinc-950 hover:border-white/30 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),inset_0_12px_16px_-6px_rgba(255,255,255,0.18),0_6px_16px_0_rgba(0,0,0,0.5)] active:scale-95 font-bold transition-all duration-200 cursor-pointer",
        
        // Secondary: KUMO UI Tactile Base styling with crisp ring line & smooth hover tint
        secondary:
          "group flex w-max shrink-0 items-center justify-center font-medium select-none border-0 shadow-xs focus:ring-purple-500/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 cursor-pointer disabled:cursor-not-allowed disabled:text-zinc-400 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 ring-1 ring-black/10 dark:ring-white/10 not-disabled:hover:bg-zinc-100 dark:not-disabled:hover:bg-zinc-800 not-disabled:hover:text-black dark:not-disabled:hover:text-white not-disabled:hover:ring-black/15 dark:not-disabled:hover:ring-white/20 not-disabled:hover:shadow-xs active:scale-95 disabled:bg-zinc-100/50 disabled:text-zinc-400 dark:disabled:bg-zinc-800/50 transition-all duration-200",
        
        outline:
          "border border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:border-purple-300 dark:hover:border-purple-700 hover:text-purple-700 dark:hover:text-purple-300 text-zinc-900 dark:text-zinc-100 transition-all duration-200",
        ghost:
          "hover:bg-purple-50/80 dark:hover:bg-purple-950/50 hover:text-purple-700 dark:hover:text-purple-300 text-zinc-700 dark:text-zinc-300 transition-all duration-200",
        destructive:
          "bg-rose-600 text-white hover:bg-rose-700 hover:shadow-md hover:shadow-rose-600/30 active:scale-[0.98] transition-all duration-200",
        link:
          "text-purple-600 underline-offset-4 hover:underline hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 p-0 h-auto",
      },
      size: {
        default:
          "h-9 gap-1.5 rounded-xl px-4 text-xs sm:text-sm [&_svg:not([class*='size-'])]:size-4",
        xs:
          "h-6 gap-1 rounded-lg px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm:
          "h-7.5 gap-1.5 rounded-lg px-3 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        md:
          "h-9 gap-1.5 rounded-xl px-4 text-xs sm:text-sm [&_svg:not([class*='size-'])]:size-4",
        lg:
          "h-11 gap-2 rounded-2xl px-6 text-sm sm:text-base font-semibold [&_svg:not([class*='size-'])]:size-4.5",
        pill:
          "h-12 gap-2.5 rounded-full px-8 text-sm font-bold [&_svg:not([class*='size-'])]:size-4",
        icon:
          "size-9 rounded-xl p-0",
        "icon-sm":
          "size-7.5 rounded-lg p-0",
        "icon-lg":
          "size-11 rounded-2xl p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(function Button(
  { className, variant = "default", size = "default", ...props },
  ref
) {
  return (
    <ButtonPrimitive
      ref={ref}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
})

const PrimaryButton = React.forwardRef(function PrimaryButton(
  { className, size = "pill", children, ...props },
  ref
) {
  return (
    <Button ref={ref} variant="primary" size={size} className={className} {...props}>
      {children}
    </Button>
  )
})

const SecondaryButton = React.forwardRef(function SecondaryButton(
  { className, size = "default", children, ...props },
  ref
) {
  return (
    <Button ref={ref} variant="secondary" size={size} className={className} {...props}>
      {children}
    </Button>
  )
})

/**
 * High-Craft Primary CTA Button with Smooth Motion Text Slide & Arrow
 */
function PrimaryCTAButton({
  label = "Buka Prompt",
  hoverLabel = "Buka & Salin Sekarang",
  onClick,
  className = "",
  disabled = false,
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.93, y: 1 }}
      transition={{ type: "spring", stiffness: 600, damping: 22 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group relative inline-flex items-center justify-between pl-6 sm:pl-7 pr-2 py-2 h-12 rounded-full bg-gradient-to-b from-zinc-800 to-zinc-950 text-white border border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22),0_2px_4px_0_rgba(0,0,0,0.4)] hover:from-zinc-600 hover:via-zinc-850 hover:to-zinc-950 hover:border-white/30 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),inset_0_12px_16px_-6px_rgba(255,255,255,0.18),0_6px_16px_0_rgba(0,0,0,0.5)] active:scale-95 transition-all duration-200 cursor-pointer pointer-events-auto overflow-hidden select-none",
        className
      )}
    >
      <span className="relative inline-flex items-center justify-center overflow-hidden">
        {/* Default Text (Slides UP & out on hover) */}
        <span className="transition-all duration-300 group-hover:-translate-y-8 group-hover:opacity-0 group-active:scale-95 font-bold tracking-tight text-white">
          {label}
        </span>
        {/* Hover Text (Slides IN from bottom on hover) */}
        <span className="absolute inset-0 flex items-center justify-center transition-all duration-300 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 font-bold whitespace-nowrap group-active:scale-95 tracking-tight text-white">
          {hoverLabel}
        </span>
      </span>

      <div className="w-8 h-8 rounded-full bg-white text-black group-active:scale-85 flex items-center justify-center shrink-0 ml-4 relative overflow-hidden transition-all duration-300 shadow-2xs group-hover:scale-105">
        {/* Primary Arrow sliding up & out on hover */}
        <ArrowUpRight01Icon
          size={16}
          className="text-black stroke-[2.5] transition-all duration-300 group-hover:-translate-y-6 group-hover:translate-x-6"
        />
        {/* Secondary Duplicate Arrow sliding in from bottom-left on hover */}
        <ArrowUpRight01Icon
          size={16}
          className="text-black absolute transition-all duration-300 translate-y-6 -translate-x-6 group-hover:translate-y-0 group-hover:translate-x-0 stroke-[2.5]"
        />
      </div>
    </motion.button>
  )
}

const KumoPrimaryButton = PrimaryButton
const KumoSecondaryButton = SecondaryButton
const KumoCTAButton = PrimaryCTAButton

export { 
  Button, 
  PrimaryButton, 
  SecondaryButton, 
  PrimaryCTAButton,
  KumoPrimaryButton,
  KumoSecondaryButton,
  KumoCTAButton,
  buttonVariants 
}

