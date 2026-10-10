import { getAuth } from "@/app/actions/auth";
import { API_URL } from "@/lib/api";
import {
  GUEST_COURT_DASHBOARD,
  GUEST_VENDOR_DASHBOARD,
  isGuestSession,
} from "@/lib/guest-data";

const authedGet = async (path: string) => {
  const token = await getAuth();
  const isGuest = token?.startsWith("guest_") || isGuestSession();
  if (isGuest) {
    if (path === "court") return GUEST_COURT_DASHBOARD;
    if (path === "vendor") return GUEST_VENDOR_DASHBOARD;
  }

  const response = await fetch(`${API_URL}/api/dashboard/${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    },
  });
  if (!response.ok) {
    if (isGuest) {
      if (path === "court") return GUEST_COURT_DASHBOARD;
      if (path === "vendor") return GUEST_VENDOR_DASHBOARD;
    }
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || "Failed to fetch dashboard metrics");
  }
  return response.json();
};

export const fetchVendorDashboard = () => authedGet("vendor");
export const fetchCourtDashboard = () => authedGet("court");
export const fetchSuperAdminDashboard = () => authedGet("super-admin");
