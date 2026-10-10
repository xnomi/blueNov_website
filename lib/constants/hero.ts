import { HeroSettings } from "@/types";

export const DEFAULT_HERO_SETTINGS_FALLBACK: HeroSettings = {
  layout_template: "modern-split",
  badge_text: "Premium Web Novel Reader • 100% Free",
  title: "Immerse Yourself in Stories",
  title_highlight: "Without Limits",
  subtitle:
    "Explore rich fantasy epics, heartwarming romances, sci-fi sagas, and detective thrillers. Read with customizable typography, dark & sepia themes, and zero ads in your reading flow.",
  cta_primary_text: "Browse All Novels",
  cta_primary_link: "/novels",
  cta_secondary_text: "My Library",
  cta_secondary_link: "/library",
  image_url: "",
  featured_novel_ids: [],
};

export const HERO_TEMPLATES_INFO = [
  {
    id: "modern-split" as const,
    name: "Modern Split Showcase",
    description: "High-energy split layout with ambient glow, glowing badge, prominent CTA buttons, and floating visual showcase.",
    tag: "Recommended",
  },
  {
    id: "cinematic-banner" as const,
    name: "Immersive Cinematic Banner",
    description: "Atmospheric full-width banner with rich gradient scrims, glassmorphic card backdrop, and cinematic typography.",
    tag: "High Visual Impact",
  },
  {
    id: "editorial-spotlight" as const,
    name: "Editorial Book Spotlight",
    description: "Prestigious literary magazine aesthetic featuring book spotlight badges, curated author highlights, and quick genre navigation.",
    tag: "Editorial / Literary",
  },
];
