import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionTitle from "./SectionTitle";
import { projects } from "../data/projects";

gsap.registerPlugin(ScrollTrigger);

const ProjectGrid = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLDivElement>(".project-card");

      // scroll-in animation
      gsap.from(cards, {
        autoAlpha: 0,
        y: 50,
        rotateX: 8,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
        },
      });

      // hover 3D tilt for each card
      cards.forEach((card) => {
        const el = card;

        const handleMove = (e: MouseEvent) => {
          const rect = el.getBoundingClientRect();
          const relX = e.clientX - (rect.left + rect.width / 2);
          const relY = e.clientY - (rect.top + rect.height / 2);
          const maxTilt = 10;

          const rotateY = (relX / (rect.width / 2)) * maxTilt;
          const rotateX = (-relY / (rect.height / 2)) * maxTilt;

          gsap.to(el, {
            rotateX,
            rotateY,
            translateZ: 18,
            duration: 0.25,
            ease: "power3.out",
          });
        };

        const handleLeave = () => {
          gsap.to(el, {
            rotateX: 0,
            rotateY: 0,
            translateZ: 0,
            duration: 0.55,
            ease: "elastic.out(1,0.45)",
          });
        };

        el.addEventListener("mousemove", handleMove);
        el.addEventListener("mouseleave", handleLeave);

        (el as any)._handleMove = handleMove;
        (el as any)._handleLeave = handleLeave;
      });
    }, section);

    return () => {
      if (!section) return;
      const cards = section.querySelectorAll<HTMLDivElement>(".project-card");
      cards.forEach((el) => {
        const move = (el as any)._handleMove as
          | ((e: MouseEvent) => void)
          | undefined;
        const leave = (el as any)._handleLeave as
          | ((e: MouseEvent) => void)
          | undefined;
        if (move) el.removeEventListener("mousemove", move);
        if (leave) el.removeEventListener("mouseleave", leave);
      });
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="section">
      <SectionTitle
        eyebrow="Case studies"
        title="Concept projects wired to motion."
        subtitle="Every card below is just static JSON rendered with React — GSAP turns it into a motion system."
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: 18,
        }}
      >
        {projects.map((p) => (
          <article
            key={p.id}
            className="project-card card-surface"
            style={{
              padding: 16,
              transformStyle: "preserve-3d",
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#9ca3af",
                marginBottom: 6,
              }}
            >
              {p.tag}
            </div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: "-0.03em",
                marginBottom: 8,
              }}
            >
              {p.name}
            </h3>
            <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 12 }}>
              {p.description}
            </p>
            <div style={{ fontSize: 12, color: "#4ade80" }}>
              Scroll · Hover · React · GSAP
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ProjectGrid;
