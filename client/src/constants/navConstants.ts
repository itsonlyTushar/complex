import { LayoutDashboard, PlusCircle, Activity } from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  iconName: string;
}

// For Shop 
export const ADMIN_NAV_DATA: NavItem[] = [
  { title: "Dashboard", url: "/admin", iconName: "LayoutDashboard" },
  { title: "Orders", url: "/admin/orders", iconName: "ChefHat" },
  { title: "Tables", url: "/admin/tables", iconName: "MdOutlineTableRestaurant" },
  { title: "Payments", url: "/admin/payments", iconName: "Wallet" },
  { title: "Menu", url: "/admin/menu", iconName: "ClipboardList" },
  { title: "Settings", url: "/admin/settings", iconName: "Settings" },
];

// For Food Court 
export const COURT_NAV_DATA: NavItem[] = [
  {
    title: "Dashboard", url: "/court", iconName: "LayoutDashboard"
  },
  {
    title: "Restaurants", url: "/court/restaurants", iconName: "Store"
  },
  {
    title: "Settings", url: "/court/settings", iconName: "Settings"
  }
]


// For SuperAdmin 
export const SUP_NAV_DATA = [
  {
    href: '/sp', label: 'Dashboard', icon: LayoutDashboard
  },
  {
    href: '/sp/new-court', label: 'On Board Court', icon: PlusCircle
  },
  {
    href: '/sp/activity', label: 'Activity', icon: Activity
  }
];
