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
        // Primary: KUMO UI Black Obsidian with Soft Shadows & Smooth Top Light Color Transition
        primary:
          "relative overflow-hidden bg-gradient-to-b from-zinc-800 to-zinc-950 text-white border border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_1.5px_3px_0_rgba(0,0,0,0.25)] hover:from-zinc-700 hover:via-zinc-800 hover:to-zinc-950 hover:border-white/25 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35),0_3px_8px_0_rgba(0,0,0,0.3)] active:scale-95 font-bold transition-all duration-200 cursor-pointer",
        default:
          "relative overflow-hidden bg-gradient-to-b from-zinc-800 to-zinc-950 text-white border border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_1.5px_3px_0_rgba(0,0,0,0.25)] hover:from-zinc-700 hover:via-zinc-800 hover:to-zinc-950 hover:border-white/25 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35),0_3px_8px_0_rgba(0,0,0,0.3)] active:scale-95 font-bold transition-all duration-200 cursor-pointer",
        
        // White: KUMO UI Clean Crisp White Pill with Top Inset Highlight & Soft Drop Shadow
        white:
          "relative overflow-hidden bg-gradient-to-b from-white to-zinc-100/90 dark:from-zinc-800 dark:to-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-300/80 dark:border-zinc-700 shadow-[inset_0_1px_0_0_rgba(255,255,255,1),0_1.5px_3px_0_rgba(0,0,0,0.06)] hover:from-zinc-50 hover:to-zinc-200/90 hover:border-zinc-400/80 dark:hover:border-zinc-600 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,1),0_3px_8px_0_rgba(0,0,0,0.08)] active:scale-95 font-bold transition-all duration-200 cursor-pointer",
        
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

const WhiteButton = React.forwardRef(function WhiteButton(
  { className, size = "pill", children, ...props },
  ref
) {
  return (
    <Button ref={ref} variant="white" size={size} className={className} {...props}>
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
 * High-Craft Primary CTA Button with Expanding White Fill & Inverted Arrow Motion
 * Features single-line non-wrapping text and click-triggered motion playback (especially on mobile touch).
 */
function PrimaryCTAButton({
  label = "Buka Prompt",
  hoverLabel = "Buka & Salin Sekarang",
  onClick,
  className = "",
  disabled = false,
}) {
  const [isClickTriggered, setIsClickTriggered] = React.useState(false);

  const handleClick = (e) => {
    setIsClickTriggered(true);
    if (onClick) onClick(e);
    setTimeout(() => {
      setIsClickTriggered(false);
    }, 700);
  };

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 500, damping: 25 }}
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "group relative inline-flex items-center justify-between pl-4 sm:pl-6 pr-1.5 sm:pr-2 py-1.5 h-10 sm:h-11 rounded-full bg-zinc-950 text-white border border-white/15 shadow-[0_2px_10px_rgba(0,0,0,0.2)] transition-all duration-300 cursor-pointer pointer-events-auto overflow-hidden select-none whitespace-nowrap shrink-0",
        className
      )}
    >
      {/* Expanding White Fill Circle from Arrow Button on Hover & Click */}
      <span 
        aria-hidden="true" 
        className={cn(
          "absolute right-1.5 top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white transition-transform duration-500 ease-out origin-center pointer-events-none z-0",
          isClickTriggered ? "scale-[20]" : "scale-0 group-hover:scale-[20]"
        )} 
      />

      {/* Sliding Text Container (Strictly Single Line) */}
      <span className="relative z-10 inline-flex items-center justify-center overflow-hidden whitespace-nowrap px-1">
        {/* Default Text (Slides UP & out on hover/click) */}
        <span 
          className={cn(
            "transition-all duration-300 font-bold text-xs sm:text-sm tracking-tight whitespace-nowrap",
            isClickTriggered 
              ? "-translate-y-8 opacity-0 text-zinc-950" 
              : "group-hover:-translate-y-8 group-hover:opacity-0 text-white group-hover:text-zinc-950"
          )}
        >
          {label}
        </span>
        {/* Hover/Click Text (Slides IN from bottom on hover/click) */}
        <span 
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-300 font-bold whitespace-nowrap text-xs sm:text-sm tracking-tight",
            isClickTriggered 
              ? "translate-y-0 opacity-100 text-zinc-950" 
              : "translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 text-white group-hover:text-zinc-950"
          )}
        >
          {hoverLabel}
        </span>
      </span>

      {/* Arrow Circle Container: White by default -> Smoothly inverts to Black on hover/click */}
      <div 
        className={cn(
          "relative z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 ml-2.5 sm:ml-3 overflow-hidden transition-colors duration-300 shadow-2xs",
          isClickTriggered 
            ? "bg-zinc-950 text-white" 
            : "bg-white text-zinc-950 group-hover:bg-zinc-950 group-hover:text-white"
        )}
      >
        {/* Primary Arrow sliding up-right & out on hover/click */}
        <ArrowUpRight01Icon
          size={15}
          className={cn(
            "stroke-[2.5] transition-all duration-300",
            isClickTriggered 
              ? "text-white -translate-y-6 translate-x-6" 
              : "text-zinc-950 group-hover:text-white group-hover:-translate-y-6 group-hover:translate-x-6"
          )}
        />
        {/* Secondary Duplicate Arrow sliding in from bottom-left on hover/click */}
        <ArrowUpRight01Icon
          size={15}
          className={cn(
            "absolute stroke-[2.5] transition-all duration-300",
            isClickTriggered 
              ? "text-white translate-y-0 translate-x-0" 
              : "text-zinc-950 group-hover:text-white translate-y-6 -translate-x-6 group-hover:translate-y-0 group-hover:translate-x-0"
          )}
        />
      </div>
    </motion.button>
  );
}

const KumoPrimaryButton = PrimaryButton
const KumoWhiteButton = WhiteButton
const KumoSecondaryButton = SecondaryButton
const KumoCTAButton = PrimaryCTAButton

export { 
  Button, 
  PrimaryButton, 
  WhiteButton,
  SecondaryButton, 
  PrimaryCTAButton,
  KumoPrimaryButton,
  KumoWhiteButton,
  KumoSecondaryButton,
  KumoCTAButton,
  buttonVariants 
}

