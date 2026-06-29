import type { ReactNode } from "react";
import { MotionConfig, motion, useScroll } from "framer-motion";
import ThemeInjector from "./ThemeInjector";
import Header from "./Header";
import Footer from "./Footer";

/** Shared page chrome (theme, header, scroll progress, footer) used by the
 *  homepage and every content page / blog post. */
export default function Shell({ children }: { children: ReactNode }) {
  const { scrollYProgress } = useScroll();
  return (
    <MotionConfig reducedMotion="user">
      <ThemeInjector />
      <a className="skip-link" href="#main">Zum Inhalt springen</a>
      <motion.div
        className="progress"
        aria-hidden="true"
        style={{ width: "100%", scaleX: scrollYProgress, transformOrigin: "0% 50%" }}
      />
      <Header />
      <main id="main">
        <span id="top" />
        {children}
      </main>
      <Footer />
    </MotionConfig>
  );
}
