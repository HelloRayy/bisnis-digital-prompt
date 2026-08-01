import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function AnimatedNumber({ value, className = "" }) {
  const formatted = Number(value || 0).toLocaleString();

  return (
    <span className={`inline-flex overflow-hidden ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={value}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ type: "spring", stiffness: 450, damping: 25 }}
          className="inline-block"
        >
          {formatted}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
