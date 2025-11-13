"use client";

import { Link as HeroUILink } from "@heroui/link";
import { Button, Divider, Tooltip } from "@heroui/react";
import { Link, usePathname, useRouter } from "@/lib/navigation";
import { createClient } from "@/lib/supabase/client";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import { title } from "@/components/primitives";
import { Settings, LogOut, User as UserIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useSidebar } from "@/lib/sidebar-context";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface AppSidebarProps {
  user: any;
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const t = useTranslations("sidebar");

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  // Map of route paths to translation keys
  const navLabelMap: Record<string, string> = {
    "/dashboard": "dashboard",
    "/openings": "openings",
    "/practice": "practice",
    "/stacks": "stacks",
    "/custom-openings": "customOpenings",
    "/statistics": "statistics",
  };

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isCollapsed ? 64 : 256,
      }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
      }}
      className="border-r border-divider bg-content1/80 backdrop-blur-xl flex flex-col min-h-screen relative"
    >
      {/* Logo */}
      <div className={`flex justify-center ${isCollapsed ? "p-2 py-4" : "p-4"}`}>
        <Link href="/dashboard" className="flex items-center">
          <Image src="/LP.png" width={30} height={30} alt="Logo" className={isCollapsed ? "" : "mr-2"} />
          {!isCollapsed && (
            <>
              <span className={title({ color: "pink", size: "sm" })}>Line</span>
              <span className={title({ color: "blue", size: "sm" })}>Prep&nbsp;</span>
            </>
          )}
        </Link>
      </div>

      <Divider />

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {siteConfig.appNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          const translatedLabel = t(navLabelMap[item.href] as any);

          if (isCollapsed) {
            return (
              <Tooltip key={item.href} content={translatedLabel} placement="right">
                <div>
                  <Link
                    href={item.href}
                    className={`flex items-center justify-center px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "hover:bg-default-100 text-default-800 dark:text-default-200"
                    }`}
                  >
                    <Icon size={22} strokeWidth={2} className="flex-shrink-0" />
                  </Link>
                </div>
              </Tooltip>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-default-100 text-foreground"
              }`}
            >
              <Icon size={20} strokeWidth={2} />
              <span className="font-medium">{translatedLabel}</span>
            </Link>
          );
        })}
      </nav>

      <Divider />

      {/* User section */}
      <div className={`p-4 space-y-3 ${isCollapsed ? "flex flex-col items-center" : ""}`}>
        {isCollapsed ? (
          <>
            {/* Collapsed user section */}
            <Tooltip content={t("profile")} placement="right">
              <Button
                as={Link}
                href="/profile"
                isIconOnly
                variant="light"
                size="sm"
                aria-label={t("profile")}
              >
                <UserIcon size={20} />
              </Button>
            </Tooltip>
            <Tooltip content={t("settings")} placement="right">
              <Button
                as={Link}
                href="/settings"
                isIconOnly
                variant="light"
                size="sm"
                aria-label={t("settings")}
              >
                <Settings size={20} />
              </Button>
            </Tooltip>
            <Tooltip content={t("signOut")} placement="right">
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onPress={handleSignOut}
                aria-label={t("signOut")}
              >
                <LogOut size={20} />
              </Button>
            </Tooltip>
          </>
        ) : (
          <>
            {/* Expanded user section */}
            <div className="flex items-center justify-between px-2">
              <Link href="/profile" className="flex-1 min-w-0 text-foreground hover:text-foreground">
                <div className="flex items-center gap-2">
                  <UserIcon size={20} className="text-foreground" />
                  <span className="text-sm font-medium truncate text-foreground">
                    {user.email?.split('@')[0] || 'User'}
                  </span>
                </div>
              </Link>
              <div className="flex items-center gap-2">
                <Tooltip content={t("settings")}>
                  <Button
                    as={Link}
                    href="/settings"
                    isIconOnly
                    variant="light"
                    size="sm"
                    aria-label={t("settings")}
                  >
                    <Settings size={20} />
                  </Button>
                </Tooltip>
              </div>
            </div>

            <Button
              color="default"
              variant="flat"
              className="w-full"
              onPress={handleSignOut}
              startContent={<LogOut size={16} />}
            >
              {t("signOut")}
            </Button>
          </>
        )}
      </div>

      <Divider />

      {/* Toggle button */}
      <div className={`p-2 ${isCollapsed ? "flex justify-center" : "flex justify-end"}`}>
        <Tooltip content={isCollapsed ? t("expandSidebar") : t("collapseSidebar")} placement="right">
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onPress={toggleSidebar}
            aria-label={isCollapsed ? t("expandSidebar") : t("collapseSidebar")}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </Tooltip>
      </div>
    </motion.aside>
  );
}