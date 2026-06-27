import { useRef } from "react";
import type { ElementType, ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, type Variants } from "framer-motion";

type TiltCardProps = {
  as?: "article" | "a" | "div";
  className?: string;
  children: ReactNode;
  variants?: Variants;
  href?: string;
  max?: number;
};

/**
 * Premium 3D tilt: the card rotates toward the cursor (spring-smoothed) and
 * lifts on hover. Falls back to a plain element when reduced motion is requested.
 */
export default function TiltCard({ as = "article", className, children, variants, href, max = 8 }: TiltCardProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 200, damping: 18 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 200, damping: 18 });

  const MotionTag = motion(as as ElementType) as ElementType;

  function handleMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  }
  function handleLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <MotionTag
      ref={ref as never}
      href={href}
      className={className}
      variants={variants}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 900, transformStyle: "preserve-3d" }}
      whileHover={reduce ? undefined : { y: -6, scale: 1.015 }}
    >
      {children}
    </MotionTag>
  );
}
