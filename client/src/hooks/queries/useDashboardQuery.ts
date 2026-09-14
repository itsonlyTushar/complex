import { useQuery } from "@tanstack/react-query";
import {
    fetchVendorDashboard,
    fetchCourtDashboard,
    fetchSuperAdminDashboard,
} from "@/services/dashboard.service";

export const DASHBOARD_KEYS = {
    vendor: () => ["dashboard", "vendor"],
    court: () => ["dashboard", "court"],
    superAdmin: () => ["dashboard", "super-admin"],
};

export const useGetVendorDashboard = () => {
    return useQuery({
        queryKey: DASHBOARD_KEYS.vendor(),
        queryFn: fetchVendorDashboard,
        refetchInterval: 30000,
    });
};

export const useGetCourtDashboard = () => {
    return useQuery({
        queryKey: DASHBOARD_KEYS.court(),
        queryFn: fetchCourtDashboard,
        refetchInterval: 30000,
    });
};

export const useGetSuperAdminDashboard = () => {
    return useQuery({
        queryKey: DASHBOARD_KEYS.superAdmin(),
        queryFn: fetchSuperAdminDashboard,
        refetchInterval: 30000,
    });
};
