import { MotionConfig, motion, useScroll } from "framer-motion";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import CircleMarquee from "./components/CircleMarquee";
import About from "./components/About";
import Stats from "./components/Stats";
import Services from "./components/Services";
import Projects from "./components/Projects";
import Why from "./components/Why";
import Testimonials from "./components/Testimonials";
import Faq from "./components/Faq";
import Cta from "./components/Cta";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CallBar from "./components/CallBar";

export default function App() {
  const { scrollYProgress } = useScroll();

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">Zum Inhalt springen</a>
      <motion.div
        className="progress"
        aria-hidden="true"
        style={{ width: "100%", scaleX: scrollYProgress, transformOrigin: "0% 50%" }}
      />

      <Header />

      <main id="main">
        <span id="top" />
        <Hero />
        <About />
        <Marquee />
        <Stats />
        <Services />
        <Projects />
        <Why />
        <Testimonials />
        <Faq />
        <Cta />
        <Contact />
      </main>

      <CircleMarquee />
      <Footer />
      <CallBar />
    </MotionConfig>
  );
}
