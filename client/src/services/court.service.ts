import { getAuth } from "@/app/actions/auth";
import { API_URL } from "@/lib/api";
import type { PublicFoodCourtResponse } from "@/types/restaurant.types";
import {
  GUEST_RESTAURANTS,
  GUEST_COURT_USER,
  GUEST_TABLES,
  isGuestSession,
} from "@/lib/guest-data";

export const fetchRestaurants = async () => {
  const token = await getAuth();
  const isGuest = token?.startsWith("guest_") || isGuestSession();
  if (isGuest) {
    return GUEST_RESTAURANTS;
  }

  const response = await fetch(`${API_URL}/api/court/restaurants`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    },
  });
  if (!response.ok) {
    throw new Error("failed to fetch restaurants");
  }
  return response.json();
};

export const onboardRestaurant = async (data: any) => {
  const token = await getAuth();
  const isGuest = token?.startsWith("guest_") || isGuestSession();
  if (isGuest) {
    const newRestaurant = {
      id: `demo-stall-${Date.now()}`,
      name: data.restaurantName || "New Stall",
      location: data.location || "Counter",
      createdAt: new Date().toISOString(),
      foodCourtId: "demo-court-1",
      isClosed: false,
      status: true,
      onBoradingCompleted: true,
      commissionRate: 5.0,
      description: "Guest mode simulated stall",
      vendors: [],
    };
    return newRestaurant;
  }

  const response = await fetch(`${API_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message || "Failed to onboard restaurant");
  }
  return response.json();
};

export const deleteRestaurant = async (id: string) => {
  const token = await getAuth();
  const isGuest = token?.startsWith("guest_") || isGuestSession();
  if (isGuest) {
    return { message: "Restaurant removed in demo session", id };
  }

  const response = await fetch(`${API_URL}/api/court/restaurants/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    },
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message || "Failed to delete restaurant");
  }
  return response.json();
};

export const editRestaurant = async (id: string, data: any) => {
  const token = await getAuth();
  const isGuest = token?.startsWith("guest_") || isGuestSession();
  if (isGuest) {
    return { message: "Restaurant updated in demo session", id, ...data };
  }

  const response = await fetch(`${API_URL}/api/court/restaurants/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message || "Failed to edit restaurant");
  }
  return response.json();
};

export const updateFoodCourtStatus = async (isClosed: boolean) => {
  const token = await getAuth();
  const isGuest = token?.startsWith("guest_") || isGuestSession();
  if (isGuest) {
    GUEST_COURT_USER.foodCourt.isClosed = isClosed;
    return { ...GUEST_COURT_USER.foodCourt, isClosed };
  }

  const response = await fetch(`${API_URL}/api/court/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    },
    body: JSON.stringify({ isClosed }),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message || "Failed to update food court status");
  }
  return response.json();
};

export const fetchPublicFoodCourt = async (
  foodCourtId: string,
  tableId?: string | null,
): Promise<PublicFoodCourtResponse> => {
  const isGuest = foodCourtId === "demo-court-1" || isGuestSession();
  if (isGuest && foodCourtId === "demo-court-1") {
    if (tableId) {
      const trimmed = tableId.trim().toLowerCase();
      const tableExists = GUEST_TABLES.some(
        (t) => t.number.toLowerCase() === trimmed || String(t.id) === trimmed,
      );
      if (!tableExists) {
        throw new Error("Invalid Table for this Food Court");
      }
    }

    return {
      foodCourt: {
        id: GUEST_COURT_USER.foodCourt.id,
        name: GUEST_COURT_USER.foodCourt.name,
        location: GUEST_COURT_USER.foodCourt.location,
        isClosed: GUEST_COURT_USER.foodCourt.isClosed,
        currancy: GUEST_COURT_USER.foodCourt.currancy,
        paymentSystem: GUEST_COURT_USER.foodCourt.paymentSystem,
      },
      restaurants: GUEST_RESTAURANTS.filter((r) => !r.isClosed).map((r) => ({
        id: r.id,
        name: r.name,
        logo: r.logo || null,
        description: r.description || null,
        isClosed: !!r.isClosed,
      })),
    };
  }

  const url = new URL(`${API_URL}/api/court/public/${foodCourtId}/restaurants`);
  if (tableId) {
    url.searchParams.append("tableId", tableId);
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message || "Failed to load this food court");
  }
  return response.json();
};

export const fetchPublicRestaurantDetails = async (id: string) => {
  if (id.startsWith("demo-stall") || isGuestSession()) {
    const stall = GUEST_RESTAURANTS.find((r) => r.id === id) || GUEST_RESTAURANTS[0];
    if (stall) {
      return {
        id: stall.id,
        name: stall.name,
        location: stall.location || "",
        logo: stall.logo || null,
        description: stall.description || null,
        isClosed: !!stall.isClosed,
        foodCourtId: "demo-court-1",
        foodCourt: {
          isClosed: GUEST_COURT_USER.foodCourt.isClosed,
          currancy: GUEST_COURT_USER.foodCourt.currancy,
          paymentSystem: GUEST_COURT_USER.foodCourt.paymentSystem,
        },
      };
    }
  }

  const response = await fetch(`${API_URL}/api/court/public/restaurant/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("failed to fetch restaurant details");
  }
  return response.json();
};

export const fetchMyCourtId = async () => {
  const token = await getAuth();
  const isGuest = token?.startsWith("guest_") || isGuestSession();
  if (isGuest) {
    return { foodCourtId: "demo-court-1" };
  }

  const response = await fetch(`${API_URL}/api/court/my-id`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    },
  });
  if (!response.ok) {
    throw new Error("failed to fetch food court ID");
  }
  return response.json();
};