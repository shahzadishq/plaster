import { motion, type Variants, type HTMLMotionProps } from "framer-motion";
import type { PropsWithChildren } from "react";

// Snappy expo-style ease for a prominent, confident entrance.
const EASE = [0.16, 1, 0.3, 1] as const;
const D = 0.55;

export const revealVariants = {
  fadeUp: { hidden: { opacity: 0, y: 60 }, show: { opacity: 1, y: 0, transition: { duration: D, ease: EASE } } },
  fadeDown: { hidden: { opacity: 0, y: -60 }, show: { opacity: 1, y: 0, transition: { duration: D, ease: EASE } } },
  fadeLeft: { hidden: { opacity: 0, x: 70 }, show: { opacity: 1, x: 0, transition: { duration: D, ease: EASE } } },
  fadeRight: { hidden: { opacity: 0, x: -70 }, show: { opacity: 1, x: 0, transition: { duration: D, ease: EASE } } },
  slideUp: { hidden: { opacity: 0, y: 100 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } },
  slideLeft: { hidden: { opacity: 0, x: 110 }, show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } } },
  slideRight: { hidden: { opacity: 0, x: -110 }, show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } } },
  zoomIn: { hidden: { opacity: 0, scale: 0.82, y: 40 }, show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: EASE } } },
} satisfies Record<string, Variants>;

export type RevealVariant = keyof typeof revealVariants;

// Back-compat alias
export const fadeUp = revealVariants.fadeUp;

export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 48, scale: 0.94 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE } },
};

type RevealProps = PropsWithChildren<
  HTMLMotionProps<"div"> & { className?: string; amount?: number; variant?: RevealVariant }
>;

/** Scroll-triggered entrance. Pick a `variant` (fadeUp/fadeLeft/zoomIn/…). */
export function Reveal({ children, className, amount = 0.2, variant = "fadeUp", ...rest }: RevealProps) {
  return (
    <motion.div
      className={className}
      variants={revealVariants[variant]}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
