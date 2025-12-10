export type Project = {
  id: number;
  name: string;
  tag: string;
  description: string;
};

export const projects: Project[] = [
  {
    id: 1,
    name: "Orbit Commerce",
    tag: "3D product gallery",
    description:
      "A 3D storefront where products float in space and respond to scroll depth.",
  },
  {
    id: 2,
    name: "Neon District",
    tag: "Immersive city tour",
    description:
      "A scroll-driven cityscape with parallax skylines and layered neon motion.",
  },
  {
    id: 3,
    name: "Lens Studio",
    tag: "Portfolio engine",
    description:
      "Cinematic portfolio layouts with timeline-scrolled case studies.",
  },
  {
    id: 4,
    name: "Nova Launch",
    tag: "Product launch page",
    description:
      "A launch page where every section feels like a cut from a motion reel.",
  },
  {
    id: 5,
    name: "Synthwave Docs",
    tag: "Docs, but alive",
    description:
      "Technical documentation pages with subtle 3D cards and scroll-linked indicators.",
  },
  {
    id: 6,
    name: "Constellation UI",
    tag: "Design system",
    description:
      "A design system demo where components orbit and snap into constellations.",
  },
];
