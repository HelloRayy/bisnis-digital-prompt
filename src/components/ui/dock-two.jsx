import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const DockIconButton = React.forwardRef(
  ({ icon: Icon, label, onClick, isActive, isLocked, isDisabled, className, onHover }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const disabled = isLocked || isDisabled;

    return (
      <motion.button
        ref={ref}
        disabled={disabled}
        onClick={disabled ? undefined : onClick}
        onMouseEnter={() => {
          setIsHovered(true);
          if (onHover) onHover(label);
        }}
        onMouseLeave={() => setIsHovered(false)}
        whileTap={disabled ? {} : { scale: 0.92 }}
        className={cn(
          "relative group w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-150 select-none shrink-0",
          disabled
            ? "opacity-45 cursor-not-allowed text-zinc-400"
            : isActive 
              ? "text-obsidian font-bold" 
              : "text-obsidian/70 hover:text-obsidian",
          className
        )}
      >
        {/* Sliding Active Background Pill via Framer Motion layoutId */}
        {isActive && !disabled && !['Favorit', 'Disukai', 'Suka', 'Bookmark', 'Simpan', 'Tersimpan'].includes(label) && (
          <motion.div
            layoutId="dock-active-pill"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            style={{ transform: "translateZ(0)", willChange: "transform" }}
            className="absolute inset-0 rounded-xl bg-[#f0f0f0] border border-black/5 shadow-2xs z-0"
          />
        )}
        {/* Tooltip Spring Pop Entrance & Exit */}
        <AnimatePresence>
          {isHovered && label && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
              className={cn(
                "absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none z-50",
                "px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight",
                "bg-white text-obsidian border border-black/10 shadow-[0_6px_20px_rgba(0,0,0,0.12)] whitespace-nowrap flex items-center gap-1.5"
              )}
            >
              <span>{label}</span>
              {disabled && (
                <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                  Buy to unlock
                </span>
              )}
              {/* Bottom Arrow Indicator */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-[5px] border-x-transparent border-t-[5px] border-t-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Icon & Lock Badge */}
        <div className="relative z-10 flex items-center justify-center">
          {Icon && (
            <motion.div
              animate={
                isHovered && !disabled 
                  ? (label === 'Favorit' || label === 'Disukai' || label === 'Suka' 
                      ? { scale: [1, 1.32, 0.9, 1.18, 1] } 
                      : { scale: [1, 1.18, 1] })
                  : { scale: 1, rotate: 0 }
              }
              transition={{ duration: 0.45, ease: "easeInOut" }}
            >
              {(label === 'Favorit' || label === 'Disukai' || label === 'Suka') ? (
                <svg 
                  viewBox="0 0 24 24" 
                  className={cn("w-5 h-5 shrink-0 transition-all", isActive ? "text-red-500" : "text-obsidian/70")} 
                  fill={isActive ? "#ef4444" : "none"} 
                  stroke={isActive ? "#ef4444" : "currentColor"}
                  strokeWidth="2"
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              ) : (label === 'Bookmark' || label === 'Simpan' || label === 'Tersimpan') ? (
                <svg 
                  viewBox="0 0 24 24" 
                  className={cn("w-5 h-5 shrink-0 transition-all", isActive ? "text-amber-500" : "text-obsidian/70")} 
                  fill={isActive ? "#f59e0b" : "none"} 
                  stroke={isActive ? "#f59e0b" : "currentColor"}
                  strokeWidth="2"
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              ) : (
                <Icon className="w-5 h-5 shrink-0" />
              )}
            </motion.div>
          )}
          {disabled && (
            <div className="absolute -top-1.5 -right-1.5 bg-zinc-800 text-white rounded-full p-0.5 shadow-2xs border border-white">
              <Lock size={9} />
            </div>
          )}
        </div>
      </motion.button>
    );
  }
);

DockIconButton.displayName = "DockIconButton";

const Dock = React.forwardRef(
  ({ items = [], className }, ref) => {
    return (
      <div 
        ref={ref} 
        className={cn(
          "fixed bottom-6 left-1/2 -translate-x-1/2 z-40 select-none max-w-[95vw]",
          className
        )}
      >
        {/* Clean Rounded Card Container */}
        <div
          className={cn(
            "flex items-center gap-1 p-1.5 rounded-2xl sm:rounded-3xl",
            "bg-white/95 backdrop-blur-xl border border-black/10 shadow-[0_16px_40px_rgba(0,0,0,0.12)]"
          )}
        >
          {items.map((item, idx) => (
            <React.Fragment key={item.label || idx}>
              {item.isSeparator ? (
                <div className="h-5 w-px bg-black/10 mx-1 shrink-0" />
              ) : (
                <DockIconButton {...item} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }
);

Dock.displayName = "Dock";

export { Dock, DockIconButton };