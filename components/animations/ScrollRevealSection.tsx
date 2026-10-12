"use client";

import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

interface ScrollRevealSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale";
}

export const ScrollRevealSection = React.memo(function ScrollRevealSection({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: ScrollRevealSectionProps) {
  const initialOffset =
    direction === "up"
      ? { opacity: 0, y: 36, scale: 0.98 }
      : direction === "down"
      ? { opacity: 0, y: -36, scale: 0.98 }
      : direction === "left"
      ? { opacity: 0, x: -44, scale: 0.98 }
      : direction === "right"
      ? { opacity: 0, x: 44, scale: 0.98 }
      : { opacity: 0, scale: 0.92 };

  return (
    <motion.div
      initial={initialOffset}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{
        type: "spring",
        stiffness: 180,
        damping: 24,
        mass: 0.85,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

/**
 * Smooth top-of-viewport scroll progress indicator bar driven by spring physics.
 */
export const ScrollProgressBar = React.memo(function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 z-50 h-1 origin-left bg-gradient-to-r from-brand-cyan via-brand-blue to-flavour-mango pointer-events-none shadow-[0_0_10px_rgba(56,189,248,0.8)]"
    />
  );
});
