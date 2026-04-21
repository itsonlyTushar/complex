import { CourtSidebar } from "@/components/court/court-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import React from "react";

export const CourtLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "13rem",
        } as React.CSSProperties
      }
    >
      <CourtSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-between">
          <div className="flex items-center">
            <SidebarTrigger className="-ml-1" />
            <Separator className="mr-2 h-4" orientation="vertical" />
            <h1 className="font-semibold">Food Court / Mall Name</h1>
          </div>

          <div>
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default CourtLayout;
