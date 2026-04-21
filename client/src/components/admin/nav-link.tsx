"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";
import { SidebarMenuButton } from "../ui/sidebar";
import { ChefHat, ClipboardList, LayoutDashboard, Settings, Wallet, type LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  ChefHat,
  Wallet,
  ClipboardList,
  Settings,
};

interface NavLinkProps {
  title: string;
  url: string;
  iconName: string;
}

export function NavLink({ title, url, iconName }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === url;
  const Icon = ICON_MAP[iconName] || LayoutDashboard;

  return (
    <SidebarMenuButton asChild tooltip={title} isActive={isActive}>
      <Link href={url} className="flex items-center gap-2">
        <Icon className="size-4" />
        <span>{title}</span>
      </Link>
    </SidebarMenuButton>
  );
}

