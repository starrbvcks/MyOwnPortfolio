export const siteMeta = {
  name: "SETAREH",
  location: "BASED IN TEHRAN",
  year: "2026",
  discipline: "WEB DESIGN / UI DESIGN / WEB DEVELOPMENT",
  serviceLabel: "DESIGN + DEVELOPMENT",
  email: "sstarehk@gmail.com",
  github: "https://github.com/starrbvcks",
  instagram: "@starrbvckssss",
  availability: "PORTFOLIO SITES / EDITORIAL INTERFACES / CREATIVE FRONT-END",
};

export const navigation = [
  { label: "Work", href: "#work", number: "001" },
  { label: "About", href: "#about", number: "002" },
  { label: "Playground", href: "#playground", number: "003" },
  { label: "Browser", href: "#visual", number: "004" },
  { label: "Contact", href: "#contact", number: "005" },
] as const;

export type ProjectItem = {
  id: string;
  number: string;
  title: string;
  year: string;
  role: string;
  projectType: string;
  services: string[];
  responsibilities: string[];
  status: string;
  tools: string;
  technologies: string[];
  category: string;
  image: string;
  images?: string[];
  imageAlt: string;
  description: string;
  challenge: string;
  solution: string;
  interaction: string;
  accessibilityNotes: string;
  result: string;
  variant: "featured" | "split" | "pink";
  liveUrl?: string;
  githubUrl?: string;
};

export const projects = [
  {
    id: "eleanor",
    number: "01",
    title: "Eleanor",
    year: "2026",
    role: "Web Design / UI Design / Web Development",
    projectType: "Self-initiated portfolio case study",
    services: ["Interface design", "Front-end build", "Responsive systems"],
    responsibilities: ["Art direction", "Product flow", "Reusable UI patterns"],
    status: "Concept build",
    tools: "Figma / React / TypeScript / Framer Motion",
    technologies: ["React", "TypeScript", "Responsive Components", "Framer Motion"],
    category: "Fashion E-commerce Experience",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=82",
    images: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=82",
    ],
    imageAlt: "Editorial homepage design for the Eleanor fashion e-commerce project",
    description:
      "A concept fashion storefront shaped around editorial pacing, clear product discovery, and a browsing flow that still feels tactile.",
    challenge:
      "Balance a bold fashion identity with clear product browsing and conversion.",
    solution:
      "Built an editorial shopping flow with reusable product modules, campaign-led imagery, and crisp mobile navigation.",
    interaction:
      "Subtle image transitions, accessible hover states, and mobile-first product discovery.",
    accessibilityNotes:
      "Clear navigation landmarks, visible focus states, and readable product metadata.",
    result:
      "A polished concept that keeps the shopping path readable while giving the brand a stronger visual point of view.",
    variant: "featured",
    liveUrl: "",
    githubUrl: "",
  },
  {
    id: "monolith",
    number: "02",
    title: "Monolith",
    year: "2026",
    role: "Art Direction / Web Design / Motion",
    projectType: "Experimental brand and archive study",
    services: ["Art direction", "Motion design", "Interface structure"],
    responsibilities: ["Archive layout", "Motion language", "Content hierarchy"],
    status: "Experimental build",
    tools: "Figma / React / Framer Motion / CSS",
    technologies: ["React", "Framer Motion", "CSS Grid", "Audio-first UI"],
    category: "Experimental Music Label Website",
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=82",
    images: [
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=82",
    ],
    imageAlt: "Dark experimental interface for the Monolith music label website",
    description:
      "A stark label-site exploration that turns releases, artists, and live notes into a noisy but navigable digital archive.",
    challenge:
      "Create a raw label identity while keeping releases, artists, and events easy to scan.",
    solution:
      "Used a modular archive structure with motion-led transitions and strong typographic wayfinding.",
    interaction:
      "Release rows respond with restrained motion and preview-style metadata reveals.",
    accessibilityNotes:
      "Hover details are duplicated in visible text so touch and keyboard users keep context.",
    result:
      "A flexible archive direction with atmosphere, hierarchy, and enough structure to support frequent updates.",
    variant: "split",
    liveUrl: "",
    githubUrl: "",
  },
  {
    id: "neural-forge",
    number: "03",
    title: "Neural Forge",
    year: "2026",
    role: "Product Design / UI Design / Web Development",
    projectType: "Technical landing-page concept",
    services: ["Product storytelling", "UI systems", "Front-end development"],
    responsibilities: ["Page architecture", "Responsive components", "Interaction states"],
    status: "Portfolio concept",
    tools: "Figma / React / TypeScript / Tailwind",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Accessible UI"],
    category: "AI Development Tool Landing Page",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=82",
    images: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=82",
    ],
    imageAlt: "AI developer platform landing page interface for Neural Forge",
    description:
      "A technical landing-page concept with a sharper product story, modular UI sections, and enough attitude to avoid default SaaS patterns.",
    challenge:
      "Make an AI developer product feel credible and technical without slipping into generic SaaS.",
    solution:
      "Combined dense product messaging, strong UI frames, and reusable landing-page sections.",
    interaction:
      "Component previews use small motion cues while preserving reading flow and keyboard access.",
    accessibilityNotes:
      "High-contrast sections, semantic content order, and reduced-motion-friendly interactions.",
    result:
      "A credible product-page direction that explains the tool while showing front-end craft.",
    variant: "pink",
    liveUrl: "",
    githubUrl: "",
  },
] satisfies ProjectItem[];

export const experiments = [
  {
    number: "001",
    title: "Scroll Typography Study",
    type: "Motion Prototype",
    technology: "Framer Motion / React",
    note: "A motion sketch for mapping scroll progress to staggered editorial type without hiding the actual message.",
    year: "2026",
  },
  {
    number: "002",
    title: "Cursor Distortion Experiment",
    type: "Interaction Study",
    technology: "Canvas / TypeScript",
    note: "A pointer-led distortion study with a static touch fallback so the idea is still readable without a cursor.",
    year: "2026",
  },
  {
    number: "003",
    title: "Interactive Album Poster",
    type: "Digital Poster",
    technology: "CSS / Framer Motion",
    note: "A responsive poster prototype where track metadata, halftone overlays, and motion cues behave like interface material.",
    year: "2026",
  },
] as const;

export const visualDesignItems = [
  {
    title: "Poster Design",
    category: "Editorial Print",
    year: "2026",
    note: "A static typographic system built around tension, silence, and one aggressive pink mark.",
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80",
    imageAlt: "High contrast editorial poster design with architectural geometry",
    variant: "large",
  },
  {
    title: "Album Cover",
    category: "Music Artwork",
    year: "2026",
    note: "Black-and-white texture, oversized type, and a sharp visual signature for a noisy release.",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Moody album cover direction with performer and dark stage lighting",
    variant: "image",
  },
  {
    title: "Typography Study",
    category: "Type System",
    year: "2025",
    note: "Static display-type studies balancing brutal scale with readable composition.",
    image: "",
    imageAlt: "",
    variant: "pink",
  },
  {
    title: "Visual Identity",
    category: "Brand Direction",
    year: "2025",
    note: "A compact identity kit with marks, rules, motion behavior, and digital usage notes.",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Abstract visual identity collage with vivid pink and dark shapes",
    variant: "image",
  },
  {
    title: "Logo System",
    category: "Identity Design",
    year: "2026",
    note: "A flexible mark set designed for small UI surfaces and large editorial moments.",
    image: "",
    imageAlt: "",
    variant: "dark",
  },
  {
    title: "Digital Collage",
    category: "Art Direction",
    year: "2025",
    note: "Layered interface fragments, scanned texture, and motion-ready image masks.",
    image:
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Digital collage artwork with bright abstract forms and deep contrast",
    variant: "wide",
  },
] as const;
