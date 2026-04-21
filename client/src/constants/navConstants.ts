export interface NavItem {
  title: string;
  url: string;
  iconName: string;
}

export const ADMIN_NAV_DATA: NavItem[] = [
  { title: "Dashboard", url: "/admin", iconName: "LayoutDashboard" },
  { title: "Orders", url: "/admin/orders", iconName: "ChefHat" },
  { title: "Payments", url: "/admin/payments", iconName: "Wallet" },
  { title: "Menu", url: "/admin/menu", iconName: "ClipboardList" },
  { title: "Settings", url: "/admin/settings", iconName: "Settings" },
];


