import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionTitle from "./SectionTitle";

gsap.registerPlugin(ScrollTrigger);

const MotionBands = () => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const ctx = gsap.context(() => {
      const bands = Array.from(
        wrapper.querySelectorAll<HTMLElement>(".parallax-band")
      );

      // fade + rise in
      gsap.from(bands, {
        autoAlpha: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: wrapper,
          start: "top 80%",
        },
      });

      // pinned subtle parallax
      ScrollTrigger.create({
        trigger: wrapper,
        start: "top center",
        end: "+=400",
        scrub: true,
        pin: true,
        onUpdate: (self) => {
          bands.forEach((band, index) => {
            const depth = (index + 1) * 0.18;
            const offset = (self.progress - 0.5) * 120 * depth;
            gsap.to(band, {
              y: offset,
              ease: "none",
              overwrite: true,
            });
          });
        },
      });
    }, wrapper);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section motion-wrapper" ref={wrapperRef}>
      <SectionTitle
        eyebrow="Motion system"
        title="Scroll defines the camera move."
        subtitle="Rather than scrolling text blocks, we treat every section like a shot in a 3D scene and move layers at different depths."
      />

      <div style={{ display: "grid", gap: 14 }}>
        <div
          className="parallax-band"
          style={{
            background:
              "linear-gradient(90deg, rgba(59,130,246,0.26), rgba(15,23,42,0.9))",
          }}
        >
          <div className="eyebrow" style={{ marginBottom: 4 }}>
            01 · Foreground
          </div>
          <div style={{ fontSize: 14 }}>
            UI elements closest to the user react fastest to scroll and mouse —
            buttons, cards and key metrics.
          </div>
        </div>

        <div
          className="parallax-band"
          style={{
            background:
              "linear-gradient(90deg, rgba(236,72,153,0.3), rgba(15,23,42,0.95))",
          }}
        >
          <div className="eyebrow" style={{ marginBottom: 4 }}>
            02 · Midground
          </div>
          <div style={{ fontSize: 14 }}>
            Storytelling content — copy, imagery and supporting visuals —
            travels at a softer pace in the midground.
          </div>
        </div>

        <div
          className="parallax-band"
          style={{
            background:
              "linear-gradient(90deg, rgba(52,211,153,0.28), rgba(15,23,42,0.9))",
          }}
        >
          <div className="eyebrow" style={{ marginBottom: 4 }}>
            03 · Background
          </div>
          <div style={{ fontSize: 14 }}>
            Radial glows, gradients and noise give the illusion of a volumetric
            stage behind everything else.
          </div>
        </div>
      </div>
    </section>
  );
};

export default MotionBands;
