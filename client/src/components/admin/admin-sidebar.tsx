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
import { logout } from "@/app/actions/auth";
import { Logo } from "../ui/logo";
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
      <SidebarHeader className="h-12 flex-row items-center gap-2.5 border-b px-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
        <Logo markOnly size={28} className="hidden group-data-[collapsible=icon]:block" />
        <Logo size={22} className="group-data-[collapsible=icon]:hidden" />
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
                  tooltip="Log out"
                  className="cursor-pointer hover:bg-state-late-bg hover:text-state-late"
                >
                  <LogOut className="size-4" />
                  <span>Log out</span>
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