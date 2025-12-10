import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Hero3D = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const card = cardRef.current;
    const btn = btnRef.current;
    if (!container || !card) return;

    const timelines: gsap.core.Tween[] = [];
    const scrollTriggers: ScrollTrigger[] = [];

    const ctx = gsap.context(() => {
      /* -------------------------------------------------
         1) Hero word-by-word intro animation
      --------------------------------------------------- */
      const words = gsap.utils.toArray<HTMLElement>(".hero-word");
      if (words.length) {
        timelines.push(
          gsap.from(words, {
            y: 40,
            autoAlpha: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.06,
          })
        );
      }

      /* Sub text */
      const sub = container.querySelector(".hero-subtext");
      if (sub) {
        timelines.push(
          gsap.from(sub, {
            autoAlpha: 0,
            y: 20,
            duration: 0.7,
            ease: "power3.out",
            delay: 0.2,
          })
        );
      }

      /* CTA fade-in */
      const cta = container.querySelector(".hero-cta");
      if (cta) {
        timelines.push(
          gsap.from(cta, {
            autoAlpha: 0,
            y: 10,
            duration: 0.6,
            ease: "power3.out",
            delay: 0.35,
          })
        );
      }

      /* -------------------------------------------------
         2) Card pop-in (elastic)
      --------------------------------------------------- */
      timelines.push(
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 40, rotateX: 12, rotateY: -18, scale: 0.9 },
          {
            autoAlpha: 1,
            y: 0,
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 1.1,
            ease: "elastic.out(1, 0.7)",
            delay: 0.25,
          }
        )
      );

      /* -------------------------------------------------
         3) Idle floating loop
      --------------------------------------------------- */
      timelines.push(
        gsap.to(card, {
          y: -10,
          rotationX: 2,
          duration: 3,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        })
      );

      /* -------------------------------------------------
         4) Mouse-based 3D tilt
      --------------------------------------------------- */
      const handleMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        const maxTilt = 12;

        const rotateY = (relX / (rect.width / 2)) * maxTilt;
        const rotateX = (-relY / (rect.height / 2)) * maxTilt;

        gsap.to(card, {
          rotateX,
          rotateY,
          duration: 0.4,
          ease: "power3.out",
        });
      };

      const handleLeave = () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.5)",
        });
      };

      container.addEventListener("mousemove", handleMove);
      container.addEventListener("mouseleave", handleLeave);

      /* -------------------------------------------------
         5) Scroll parallax (BG glow)
      --------------------------------------------------- */
      scrollTriggers.push(
        ScrollTrigger.create({
          trigger: container,
          start: "top top",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            const shift = self.progress * 90;
            container.style.setProperty("--hero-parallax-y", `${shift}px`);
          },
        })
      );

      /* -------------------------------------------------
         6) Floating chips around hero
      --------------------------------------------------- */
      const chips = gsap.utils.toArray<HTMLElement>(".hero-chip");
      chips.forEach((chip, index) => {
        timelines.push(
          gsap.to(chip, {
            y: gsap.utils.random(-18, 18),
            x: index % 2 === 0 ? 6 : -6,
            duration: gsap.utils.random(3, 5),
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: 0.3 + index * 0.25,
          })
        );
      });

      /* -------------------------------------------------
         7) Magnetic CTA button
      --------------------------------------------------- */
      if (btn) {
        const strength = 20;

        const onBtnMove = (e: MouseEvent) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - (rect.left + rect.width / 2);
          const y = e.clientY - (rect.top + rect.height / 2);

          gsap.to(btn, {
            x: x / strength,
            y: y / strength,
            duration: 0.25,
            ease: "power3.out",
          });
        };

        const onBtnLeave = () => {
          gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.4)",
          });
        };

        btn.addEventListener("mousemove", onBtnMove);
        btn.addEventListener("mouseleave", onBtnLeave);

        /* Save cleanup in closure */
        return () => {
          btn.removeEventListener("mousemove", onBtnMove);
          btn.removeEventListener("mouseleave", onBtnLeave);
        };
      }
    }, container);

    /* -------------------------------------------------
       CLEANUP (this solves your error!) 
    --------------------------------------------------- */
    return () => {
      ctx.revert();

      // Remove listeners
      container.removeEventListener("mousemove", () => {});
      container.removeEventListener("mouseleave", () => {});

      // Kill ScrollTriggers & timelines
      scrollTriggers.forEach((s) => s.kill());
      timelines.forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="card-surface hero-bg"
      style={{
        padding: 26,
        display: "grid",
        gap: 26,
        gridTemplateColumns: "minmax(0, 3.1fr) minmax(0, 2.2fr)",
        alignItems: "center",
      }}
    >
      {/* LEFT */}
      <div style={{ position: "relative" }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>
          NEBULA LABS · 3D WEB
        </div>

        <h1
          style={{
            fontSize: 40,
            lineHeight: 1.05,
            letterSpacing: "-0.05em",
            marginBottom: 12,
          }}
        >
          <span className="hero-word">3D</span>{" "}
          <span className="hero-word">experiences</span>{" "}
          <span className="hero-word">for</span>{" "}
          <span className="hero-word">modern</span>{" "}
          <span className="hero-word" style={{ color: "#a855f7" }}>
            interfaces.
          </span>
        </h1>

        <p
          className="hero-subtext"
          style={{
            fontSize: 15,
            color: "#9ca3af",
            maxWidth: 520,
            lineHeight: 1.5,
            marginBottom: 20,
          }}
        >
          A concept studio demo built in React &amp; GSAP. Mouse-reactive 3D
          cards, scroll-linked motion and cinematic transitions — all powered by
          static JSON data.
        </p>

        <div
          className="hero-cta"
          style={{ display: "flex", gap: 12, alignItems: "center" }}
        >
          <button ref={btnRef} className="btn-primary">
            Explore case studies
          </button>
          <span style={{ fontSize: 12, color: "#9ca3af" }}>
            No backend · Pure front-end craft
          </span>
        </div>

   
      </div>

      {/* RIGHT */}
      <div
        style={{
          justifySelf: "flex-end",
          width: "100%",
          maxWidth: 380,
          perspective: "1200px",
        }}
      >
        <div
          ref={cardRef}
          style={{
            borderRadius: 26,
            padding: 18,
            background:
              "radial-gradient(circle at 0% 0%, rgba(59,130,246,0.42), transparent 55%), radial-gradient(circle at 100% 100%, rgba(236,72,153,0.55), rgba(15,23,42,1) 60%)",
            border: "1px solid rgba(148,163,184,0.5)",
            transformStyle: "preserve-3d",
            boxShadow: "0 30px 80px rgba(15,23,42,0.95)",
          }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#e5e7eb",
              opacity: 0.9,
              marginBottom: 10,
            }}
          >
            Realtime preview
          </div>

          {/* 3-layer visual demo */}
          <div
            style={{
              height: 210,
              borderRadius: 20,
              border: "1px solid rgba(148,163,184,0.55)",
              background:
                "radial-gradient(circle at 10% 10%, rgba(244,244,245,0.55), transparent 45%), radial-gradient(circle at 80% 100%, rgba(34,197,94,0.7), rgba(15,23,42,1) 60%)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Layer 1 */}
            <div
              style={{
                position: "absolute",
                inset: "20% 18% 32% 18%",
                borderRadius: 20,
                background:
                  "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(15,23,42,0.2))",
                border: "1px solid rgba(148,163,184,0.4)",
                transform: "translate3d(0, 0, 30px)",
              }}
            />

            {/* Layer 2 */}
            <div
              style={{
                position: "absolute",
                inset: "28% 12% 18% 12%",
                borderRadius: 24,
                background:
                  "linear-gradient(135deg, rgba(30,64,175,0.8), rgba(76,81,191,0.1))",
                border: "1px solid rgba(191,219,254,0.35)",
                transform: "translate3d(0, 0, 48px)",
              }}
            />

            {/* Layer 3 */}
            <div
              style={{
                position: "absolute",
                bottom: "14%",
                left: "12%",
                right: "12%",
                height: 40,
                borderRadius: 999,
                background:
                  "linear-gradient(90deg, rgba(34,197,94,0.95), rgba(56,189,248,0.9))",
                boxShadow: "0 18px 40px rgba(34,197,94,0.6)",
                transform: "translate3d(0, 0, 70px)",
              }}
            />

            {/* Gradient fade */}
            <div
              style={{
                position: "absolute",
                inset: "0 0 auto 0",
                height: "42%",
                background:
                  "linear-gradient(to bottom, rgba(15,23,42,0), rgba(15,23,42,0.95))",
              }}
            />
          </div>

          <div style={{ marginTop: 16 }}>
            <div
              style={{
                fontSize: 13,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#9ca3af",
                marginBottom: 4,
              }}
            >
              Nebula Labs
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              3D-ready front-end playground
            </div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>
              Mouse · Scroll · Time — mapped through GSAP timelines.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero3D;
