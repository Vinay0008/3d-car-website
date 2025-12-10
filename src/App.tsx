import Hero3D from "./components/Hero3D";
import MotionBands from "./components/MotionBands";
import ProjectGrid from "./components/ProjectGrid";
import StatsStrip from "./components/StatsStrip";
import ThreeBackground from "./components/ThreeBackground";
import ThreeModelReveal from "./components/ThreeModelReveal";

const App = () => {
  return (
    <div className="app-shell">
      <ThreeBackground /> 
      <header style={{ marginBottom: 22 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              fontWeight: 700,
              letterSpacing: "0.25em",
              fontSize: 12,
              textTransform: "uppercase",
            }}
          >
            NEBULA LABS
          </div>
          <nav
            style={{
              display: "flex",
              gap: 18,
              fontSize: 12,
              color: "#9ca3af",
              textTransform: "uppercase",
              letterSpacing: "0.16em",
            }}
          >
            <span>Overview</span>
            <span>Motion</span>
            <span>Projects</span>
          </nav>
        </div>
      </header>

      <Hero3D />
      <ThreeModelReveal /> 
      <MotionBands />
      <ProjectGrid />
      <StatsStrip />

      <footer
        style={{
          marginTop: 56,
          fontSize: 11,
          color: "#6b7280",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>Made as a GSAP-heavy front-end playground</span>
        <span>React · TypeScript · GSAP · 2025</span>
      </footer>
    </div>
  );
};

export default App;
