import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

const ThreeBackground = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    /** -----------------------------
     *  BASIC THREE.JS SETUP
     * ------------------------------ */
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog("#020617", 4, 12);

    const camera = new THREE.PerspectiveCamera(
      65,
      window.innerWidth / window.innerHeight,
      0.1,
      50
    );
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.setClearColor(0x000000, 0); // allow transparency
    mount.appendChild(renderer.domElement);

    /** -----------------------------
     *  PARTICLE FIELD (Nebula-like)
     * ------------------------------ */
    const COUNT = 8000;
    const positions = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10; // spread
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.035,
      color: "#94a3b8",
      transparent: true,
      opacity: 0.65,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    /** -----------------------------
     *  MOUSE PARALLAX
     * ------------------------------ */
    const mouse = { x: 0, y: 0 };
    window.addEventListener("mousemove", (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    });

    /** -----------------------------
     *  GSAP SCROLL MOVEMENT
     * ------------------------------ */
    gsap.to(camera.position, {
      z: 3.3,
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
      },
    });

    gsap.to(particles.rotation, {
      y: Math.PI * 1.8,
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      },
    });

    /** -----------------------------
     *  ANIMATION LOOP
     * ------------------------------ */
    const tick = () => {
      // camera slight follow of mouse
      camera.rotation.x += (mouse.y * 0.25 - camera.rotation.x) * 0.05;
      camera.rotation.y += (mouse.x * 0.25 - camera.rotation.y) * 0.05;

      particles.rotation.y += 0.00045;
      particles.rotation.x += 0.00022;

      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    };

    tick();

    /** -----------------------------
     *  HANDLE RESIZE
     * ------------------------------ */
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    /** -----------------------------
     *  CLEANUP (IMPORTANT)
     * ------------------------------ */
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
};

export default ThreeBackground;
