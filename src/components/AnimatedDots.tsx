// Two drifting dot layers that create a subtle "video-like" animated background.
// Pure CSS animation (see .anim-dots in legacy.css); paused under reduced motion.
export default function AnimatedDots() {
  return (
    <div className="anim-dots" aria-hidden="true">
      <span className="anim-dots__l1" />
      <span className="anim-dots__l2" />
    </div>
  );
}
