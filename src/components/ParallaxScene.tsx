import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionTitle from "./SectionTitle";

gsap.registerPlugin(ScrollTrigger);

const ParallaxScene = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const bands = Array.from(
      section.querySelectorAll<HTMLElement>(".parallax-band")
    );

    const ctx = gsap.context(() => {
      bands.forEach((band, index) => {
        const depth = (index + 1) * 0.12;

        gsap.fromTo(
          band,
          { y: 60, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: band,
              start: "top 80%",
            },
          }
        );

        ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            const offset = (self.progress - 0.5) * 120 * depth;
            gsap.to(band, {
              y: offset,
              ease: "none",
              overwrite: true,
            });
          },
        });
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="section">
      <SectionTitle
        eyebrow="Motion system"
        title="Scroll defines the story."
        subtitle="We layer content in depth so each scroll step feels like a camera move inside a 3D set."
      />

      <div style={{ display: "grid", gap: 14 }}>
        <div
          className="parallax-band"
          style={{
            background:
              "linear-gradient(90deg, rgba(59,130,246,0.2), rgba(15,23,42,0.8))",
          }}
        >
          <div className="eyebrow" style={{ marginBottom: 4 }}>
            01 · Layers
          </div>
          <div style={{ fontSize: 14 }}>
            Foreground, midground and background bands move at different speeds,
            creating depth without WebGL.
          </div>
        </div>

        <div
          className="parallax-band"
          style={{
            background:
              "linear-gradient(90deg, rgba(236,72,153,0.28), rgba(15,23,42,0.9))",
          }}
        >
          <div className="eyebrow" style={{ marginBottom: 4 }}>
            02 · Timelines
          </div>
          <div style={{ fontSize: 14 }}>
            GSAP timelines orchestrate entry, hover, and scroll states so every
            motion feels intentional.
          </div>
        </div>

        <div
          className="parallax-band"
          style={{
            background:
              "linear-gradient(90deg, rgba(52,211,153,0.24), rgba(15,23,42,0.85))",
          }}
        >
          <div className="eyebrow" style={{ marginBottom: 4 }}>
            03 · Control
          </div>
          <div style={{ fontSize: 14 }}>
            Attach motion to scroll, mouse, or time — then combine them to
            create cinematic sequences.
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParallaxScene;
