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
      <SidebarHeader className="h-16 px-4 group-data-[collapsible=icon]:px-2 flex flex-row items-center gap-3 group-data-[collapsible=icon]:justify-center border-b border-border/50">
        <div className="size-11 group-data-[collapsible=icon]:size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg group-data-[collapsible=icon]:text-sm flex-shrink-0 border border-border">
          C
        </div>
        <div className="flex flex-col truncate group-data-[collapsible=icon]:hidden">
          <span className="font-bold text-xl leading-none">
            Court
          </span>
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
        <SidebarMenu>
          <SidebarMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <SidebarMenuButton
                  tooltip={"Logout"}
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
