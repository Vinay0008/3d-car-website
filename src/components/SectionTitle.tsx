import { type FC, useEffect, useRef } from "react";
import gsap from "gsap";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

const SectionTitle: FC<Props> = ({ eyebrow, title, subtitle }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    gsap.fromTo(
      ref.current,
      { autoAlpha: 0, y: 20 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      }
    );
  }, []);

  return (
    <div ref={ref} style={{ marginBottom: 24 }}>
      {eyebrow && (
        <div className="eyebrow" style={{ marginBottom: 6 }}>
          {eyebrow}
        </div>
      )}
      <h2
        style={{
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: "-0.03em",
          marginBottom: subtitle ? 6 : 0,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontSize: 14, color: "#9ca3af", maxWidth: 520 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
