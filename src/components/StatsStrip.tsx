import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { label: "Frames per second budget", value: 60 },
  { label: "Timed motion sequences", value: 18 },
  { label: "Interactive surfaces", value: 12 },
  { label: "Lines of GSAP config", value: 300 },
];

const StatsStrip = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const numbers = gsap.utils.toArray<HTMLElement>(".stats-number");

      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        once: true,
        onEnter: () => {
          numbers.forEach((el) => {
            const target = Number(el.dataset.target || "0");
            gsap.fromTo(
              el,
              { innerText: 0 },
              {
                innerText: target,
                duration: 1.6,
                ease: "power3.out",
                snap: { innerText: 1 },
              }
            );
          });
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section">
      <div className="eyebrow" style={{ marginBottom: 10 }}>
        Motion in numbers
      </div>
      <div className="stats-strip">
        {stats.map((s) => (
          <div key={s.label} className="stats-item">
            <div
              className="stats-number"
              data-target={s.value}
            >
              0
            </div>
            <div className="stats-label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsStrip;
