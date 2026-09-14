import { getAuth } from "@/app/actions/auth";
import { API_URL } from "@/lib/api";

const authedGet = async (path: string) => {
    const token = await getAuth();
    const response = await fetch(`${API_URL}/api/dashboard/${path}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token || ""}`,
        },
    });
    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to fetch dashboard metrics");
    }
    return response.json();
};

export const fetchVendorDashboard = () => authedGet("vendor");
export const fetchCourtDashboard = () => authedGet("court");
export const fetchSuperAdminDashboard = () => authedGet("super-admin");
