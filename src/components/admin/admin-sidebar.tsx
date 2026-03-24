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

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2 font-bold text-xl">
          <span>Admin</span>
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
            <SidebarMenuButton
              tooltip="Logout"
              className="text-destructive hover:text-destructive"
            >
              <LogOut className="size-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}


