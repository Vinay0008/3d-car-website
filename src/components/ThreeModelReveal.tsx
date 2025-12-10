import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ThreeModelReveal = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    /* -------------------------------------
     * SCENE + CAMERA
     * ------------------------------------- */
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(
      90,                                          // FIXED FOV
      mount.clientWidth / mount.clientHeight,
      0.1,
      200
    );
    camera.position.set(0, 0.4, 4);                // FIXED CAMERA POSITION

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    /* -------------------------------------
     * LIGHTS
     * ------------------------------------- */
    const keyLight = new THREE.DirectionalLight("#ffffff", 1.4);
    keyLight.position.set(4, 3, 7);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight("#a855f7", 1.1);
    rimLight.position.set(-4, 4, -2);
    scene.add(rimLight);

    scene.add(new THREE.AmbientLight("#ffffff", 0.45));

    /* -------------------------------------
     * LOAD MODEL
     * ------------------------------------- */
    const loader = new GLTFLoader();
    let model: THREE.Object3D | null = null;

    loader.load("/models/logo.glb", (gltf) => {
      model = gltf.scene;

      /* REMOVE SKETCHFAB FLOOR / SHADOW */
      model.traverse((child: any) => {
        const badWords = ["shadow", "plane", "floor", "ground", "skfb", "collider"];
        if (badWords.some((b) => child.name.toLowerCase().includes(b))) {
          child.visible = false;
        }
      });

      /* SCALE CAR UP */
      model.scale.set(1.6, 1.6, 1.6);

      /* CENTER MODEL */
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);

      /* LOWER CAR SO IT DOESN’T GET CUT (MAIN FIX) */
      model.position.y = -0.9;                     // FIXED Y-OFFSET

      scene.add(model);

      /* -------------------------------------
       * GSAP ENTRY ANIMATION
       * ------------------------------------- */
      gsap.from(model.rotation, {
        x: 0.3,
        y: -1.2,
        duration: 1.15,
        ease: "power3.out",
      });

      /* SCROLL ROTATION */
      gsap.to(model.rotation, {
        y: "+=5",
        scrollTrigger: {
          trigger: mount,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.3,
        },
      });
    });

    /* -------------------------------------
     * MOUSE PARALLAX
     * ------------------------------------- */
    const mouse = { x: 0, y: 0 };
    window.addEventListener("mousemove", (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    });

    /* -------------------------------------
     * RENDER LOOP
     * ------------------------------------- */
    const tick = () => {
      if (model) {
        model.rotation.y += (mouse.x * 0.4 - model.rotation.y) * 0.03;
        model.rotation.x += (mouse.y * 0.12 - model.rotation.x) * 0.03;
      }

      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    };
    tick();

    /* -------------------------------------
     * RESIZE HANDLER
     * ------------------------------------- */
    const onResize = () => {
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      mount.removeChild(renderer.domElement);
    };
  }, []);

  /* -------------------------------------
   * UI CONTAINER (SAFE SIZING)
   * ------------------------------------- */
  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        maxWidth: "900px",
        height: "540px",
        margin: "80px auto",
        position: "relative",
      }}
    />
  );
};

export default ThreeModelReveal;
