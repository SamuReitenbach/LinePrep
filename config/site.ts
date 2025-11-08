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
      icon: "📊",
    },
    {
      label: "Browse Openings",
      href: "/openings",
      icon: "📚",
    },
    {
      label: "Practice",
      href: "/practice",
      icon: "♟️",
    },
    {
      label: "Learning Stacks",
      href: "/stacks",
      icon: "📦",
    },
    {
      label: "Custom Openings",
      href: "/custom-openings",
      icon: "✨",
    },
    {
      label: "Statistics",
      href: "/statistics",
      icon: "📈",
    },
  ],
  
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