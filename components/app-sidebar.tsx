"use client";

import { Link } from "@heroui/link";
import { usePathname, useRouter } from "next/navigation";
import { Button, Divider, User, Tooltip } from "@heroui/react";
import { createClient } from "@/lib/supabase/client";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import { title } from "@/components/primitives";
import { SettingsIcon } from "@/components/icons";

interface AppSidebarProps {
  user: any;
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <aside className="w-64 border-r border-divider bg-content1 flex flex-col min-h-screen">
      {/* Logo */}
      <div className="p-6 pb-4">
        <Link href="/dashboard" className="flex items-center">
          <Image src="/LP.png" width={30} height={30} alt="Logo" className="mr-2"/>
          <span className={title({ color: "pink", size: "sm" })}>Line</span>
          <span className={title({ color: "blue", size: "sm" })}>Prep&nbsp;</span>
        </Link>
      </div>

      <Divider />

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {siteConfig.appNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
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
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <Divider />

      {/* User section */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between px-2">
          <Link
            href="/profile"
            className="flex-1 min-w-0"
          >
            <User
              name={user.email?.split('@')[0] || 'User'}
              classNames={{
                name: "text-sm font-medium"
              }}
            />
          </Link>
          <div className="flex items-center gap-2">
            <Tooltip content="Settings">
              <Button
                as={Link}
                href="/settings"
                isIconOnly
                variant="light"
                size="sm"
                aria-label="Settings"
              >
                <SettingsIcon size={20} />
              </Button>
            </Tooltip>
          </div>
        </div>

        <Button
          color="default"
          variant="flat"
          className="w-full"
          onPress={handleSignOut}
        >
          Sign Out
        </Button>
      </div>
    </aside>
  );
}