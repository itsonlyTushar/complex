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

export const CourtSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2 font-bold text-xl">
          <span>Court</span>
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
            <SidebarMenuButton
              onClick={async () => await logout()}
              tooltip={"Logout"}
              className="text-destructive hover:text-desctructive"
            >
              <LogOut className="size-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

CourtSidebar;
