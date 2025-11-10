import {
  BarChart3,
  BookOpen,
  Play,
  Boxes,
  Sparkles,
  TrendingUp,
  type LucideIcon
} from "lucide-react";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "LinePrep",
  description: "Master your lines.",

  // Public navigation items (shown in navbar)
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "About",
      href: "/about",
    },
  ],

  // App navigation items (for authenticated users)
  appNavItems: [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: BarChart3,
    },
    {
      label: "Browse Openings",
      href: "/openings",
      icon: BookOpen,
    },
    {
      label: "Practice",
      href: "/practice",
      icon: Play,
    },
    {
      label: "Learning Stacks",
      href: "/stacks",
      icon: Boxes,
    },
    {
      label: "Custom Openings",
      href: "/custom-openings",
      icon: Sparkles,
    },
    {
      label: "Statistics",
      href: "/statistics",
      icon: TrendingUp,
    },
  ] as Array<{
    label: string;
    href: string;
    icon: LucideIcon;
  }>,
  
  // Mobile menu items
  navMenuItems: [
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Browse Openings",
      href: "/openings",
    },
    {
      label: "Practice",
      href: "/practice",
    },
    {
      label: "Learning Stacks",
      href: "/stacks",
    },
    {
      label: "Custom Openings",
      href: "/custom-openings",
    },
    {
      label: "Statistics",
      href: "/statistics",
    },
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Settings",
      href: "/settings",
    },
  ],
  
  links: {
    github: "https://github.com/SamuReitenbach/LinePrep",
  },
};