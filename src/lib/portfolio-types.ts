export type PortfolioTemplateId =
  | "AURORA"
  | "CYBERPUNK"
  | "MINIMAL_CHIC"
  | "EXECUTIVE"
  | "DEV_RETRO";

export interface TemplateMetadata {
  id: PortfolioTemplateId;
  name: string;
  tagline: string;
  description: string;
  category: string;
  badge: string;
  accentHex: string;
  previewBg: string;
}

export const TEMPLATE_REGISTRY: Record<PortfolioTemplateId, TemplateMetadata> = {
  AURORA: {
    id: "AURORA",
    name: "Prismatic Aurora",
    tagline: "Liquid Glass & Prismatic Caustics",
    description: "Ultra-clean liquid glassmorphism with 3D ambient floating spheres, iridescent glowing borders, and buttery-smooth light refraction.",
    category: "Futuristic Glass",
    badge: "Modern & Fluid",
    accentHex: "#8b5cf6",
    previewBg: "from-indigo-900 via-purple-900 to-slate-950",
  },
  CYBERPUNK: {
    id: "CYBERPUNK",
    name: "Cyberpunk Hologram",
    tagline: "Neon Cybernetic HUD & Matrix Grid",
    description: "Deep obsidian matrix with electric cyan/magenta holographic laser grids, 3D HUD telemetry frames, and high-frequency scanlines.",
    category: "Sci-Fi / Hacker",
    badge: "Holographic 3D",
    accentHex: "#00f0ff",
    previewBg: "from-slate-950 via-cyan-950 to-fuchsia-950",
  },
  MINIMAL_CHIC: {
    id: "MINIMAL_CHIC",
    name: "Architectural Swiss",
    tagline: "Isometric Monochrome & Brutalist Luxe",
    description: "High-contrast editorial typography, deep layered 3D isometric shadow transforms, clean wireframe borders, and bold architectural precision.",
    category: "Minimalist Editorial",
    badge: "Editorial Chic",
    accentHex: "#18181b",
    previewBg: "from-neutral-900 via-stone-900 to-black",
  },
  EXECUTIVE: {
    id: "EXECUTIVE",
    name: "Obsidian & Gold",
    tagline: "Midnight Onyx & Brushed Champagne Gold",
    description: "Prestigious Forbes-tier design with metallic brushed gold bevels, drifting 3D stardust particles, serif headers, and executive pedigree tiers.",
    category: "Luxury Prestige",
    badge: "Fortune 500",
    accentHex: "#f59e0b",
    previewBg: "from-amber-950 via-stone-950 to-black",
  },
  DEV_RETRO: {
    id: "DEV_RETRO",
    name: "Synth Terminal",
    tagline: "Retro 80s CRT Glass & Phosphor Matrix",
    description: "Curved 3D CRT monitor perspective, phosphor green scanline bloom, interactive terminal command headers ($ execute --build), and arcade telemetry.",
    category: "Retro Arcade / CLI",
    badge: "Retro 80s CRT",
    accentHex: "#10b981",
    previewBg: "from-emerald-950 via-black to-slate-950",
  },
};

export interface PortfolioConfig {
  template: PortfolioTemplateId;
  bannerUrl?: string | null;
  avatarUrl?: string | null;
  headline?: string | null;
  bio?: string | null;
  projectImages?: Record<string, string>; // projectId -> imageUrl
  accentColor?: string | null;
  updatedAt: string;
}

