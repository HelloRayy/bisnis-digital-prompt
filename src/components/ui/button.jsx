import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 disabled:pointer-events-none disabled:opacity-50 active:not-aria-[haspopup]:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary: Black Emphasis with vertical linear gradient & top specular rim
        primary:
          "relative overflow-hidden bg-gradient-to-b from-zinc-800 to-zinc-950 text-white border border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22),0_2px_4px_0_rgba(0,0,0,0.4)] hover:from-zinc-750 hover:to-zinc-900 hover:border-white/25 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35),0_4px_12px_0_rgba(0,0,0,0.5)] active:scale-95 font-bold transition-all cursor-pointer",
        default:
          "relative overflow-hidden bg-gradient-to-b from-zinc-800 to-zinc-950 text-white border border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22),0_2px_4px_0_rgba(0,0,0,0.4)] hover:from-zinc-750 hover:to-zinc-900 hover:border-white/25 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35),0_4px_12px_0_rgba(0,0,0,0.5)] active:scale-95 font-bold transition-all cursor-pointer",
        
        // Secondary: Kumo tactile styling with crisp border -> Smooth purple brand tint & text color on Hover
        secondary:
          "border-0 shadow-2xs focus:ring-purple-500/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 cursor-pointer disabled:cursor-not-allowed disabled:text-zinc-400 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 ring-1 ring-black/10 dark:ring-white/10 not-disabled:hover:bg-purple-50 dark:not-disabled:hover:bg-purple-950/40 not-disabled:hover:text-purple-700 dark:not-disabled:hover:text-purple-300 not-disabled:hover:ring-purple-300/80 dark:not-disabled:hover:ring-purple-800/80 not-disabled:hover:shadow-xs disabled:bg-zinc-100/50 disabled:text-zinc-400 dark:disabled:bg-zinc-800/50 transition-all duration-200",
        
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
          "h-10 gap-2 rounded-full px-6 text-xs sm:text-sm font-semibold [&_svg:not([class*='size-'])]:size-4",
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
  { className, size = "default", ...props },
  ref
) {
  return <Button ref={ref} variant="primary" size={size} className={className} {...props} />
})

const SecondaryButton = React.forwardRef(function SecondaryButton(
  { className, size = "default", ...props },
  ref
) {
  return <Button ref={ref} variant="secondary" size={size} className={className} {...props} />
})

export { Button, PrimaryButton, SecondaryButton, buttonVariants }
