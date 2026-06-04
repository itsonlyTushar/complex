"use client"

import { ADMIN_NAV_DATA } from "@/constants/navConstants";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
  SidebarMenuButton,
} from "../ui/sidebar";
import { LogOut } from "lucide-react";
import { NavLink } from "./nav-link";
import { useGetMe } from "@/hooks/queries/useUserQuery";
import Image from "next/image";
import { logout } from "@/app/actions/auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {

  const { data: user, isLoading } = useGetMe();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="p-4 flex flex-row items-center gap-3 border-b border-border/50">
        {isLoading ? (
          <div className="size-11 bg-muted animate-pulse rounded-lg flex-shrink-0" />
        ) : user?.restaurant?.logo ? (
          <div className="relative size-11 rounded-lg overflow-hidden border border-border bg-background shadow-sm flex-shrink-0">
            <Image 
              src={user.restaurant.logo} 
              alt="logo" 
              fill
              className="object-cover animate-in fade-in duration-300"
              priority
            />
          </div>
        ) : (
          <div className="size-11 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0 border border-border">
            {user?.name?.[0]?.toUpperCase() || "A"}
          </div>
        )}
        <div className="flex flex-col truncate group-data-[collapsible=icon]:hidden">
          <span className="font-semibold text-sm leading-tight truncate">
            {user?.name || "Admin"}
          </span>
          <span className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-semibold mt-0.5">
            {user?.role?.replace(/_/g, ' ') || "Dashboard"}
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="px-2">
          {ADMIN_NAV_DATA.map((item) => (
            <SidebarMenuItem key={item.title}>
              <NavLink title={item.title} url={item.url} iconName={item.iconName} />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu className="px-2">
          <SidebarMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <SidebarMenuButton
                  tooltip="Logout"
                  className="text-destructive hover:text-destructive cursor-pointer"
                >
                  <LogOut className="size-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will be signed out of your admin dashboard. Any unsaved changes may be lost.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => await logout()}
                    variant="destructive"
                  >
                    Log Out
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}