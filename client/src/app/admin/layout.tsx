import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { PortalTitle } from "@/components/shared/portal-title";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "13rem",
        } as React.CSSProperties
      }
    >
      <AdminSidebar />
      <SidebarInset className="bg-background">
        <header className="sticky top-0 z-10 flex h-12 shrink-0 items-center justify-between gap-2 border-b bg-background/85 px-3 backdrop-blur-sm">
          <div className="flex items-center gap-1">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-1 h-4" />
            <PortalTitle />
          </div>

          <ThemeToggle />
        </header>
        <div className="flex flex-1 flex-col px-4 pb-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

