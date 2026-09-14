"use client"

import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { COURT_NAV_DATA } from "@/constants/navConstants";
import { NavLink } from "../court/nav-link";
import { Logo } from "../ui/logo";
import { LogOut } from "lucide-react";
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

export const CourtSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="h-12 flex-row items-center gap-2.5 border-b px-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
        <Logo markOnly size={28} className="hidden group-data-[collapsible=icon]:block" />
        <Logo size={22} className="group-data-[collapsible=icon]:hidden" />
        <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
          <span className="truncate text-body font-medium leading-tight">
            Complex
          </span>
          <span className="eyebrow truncate">Food court</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="px-2">
          {COURT_NAV_DATA.map((item) => (
            <SidebarMenuItem key={item.title}>
              <NavLink
                title={item.title}
                url={item.url}
                iconName={item.iconName}
              />
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
                    You will be signed out of your Food Court session. Any unsaved changes may be lost.
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
    </Sidebar>
  );
};

CourtSidebar;
