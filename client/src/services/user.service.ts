import { getAuth } from "@/app/actions/auth";
import { API_URL as BASE_API_URL } from "@/lib/api";
import {
  GUEST_COURT_USER,
  GUEST_VENDOR_USER,
  isGuestSession,
  getGuestRole,
} from "@/lib/guest-data";

const API_URL = `${BASE_API_URL}/api`;

export const fetchMe = async () => {
  const token = await getAuth();
  const isGuest = token?.startsWith("guest_") || isGuestSession();
  if (isGuest) {
    const role = getGuestRole();
    if (token === "guest_token_court" || role === "FOOD_COURT_ADMIN") {
      return GUEST_COURT_USER;
    }
    return GUEST_VENDOR_USER;
  }

  const response = await fetch(`${API_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    },
  });
  if (!response.ok) {
    throw new Error("failed to fetch user details");
  }
  return response.json();
};

export const uploadLogo = async (logo: string) => {
  const token = await getAuth();
  const isGuest = token?.startsWith("guest_") || isGuestSession();
  if (isGuest) {
    return { success: true };
  }

  const response = await fetch(`${API_URL}/users/update-logo`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    },
    body: JSON.stringify({ logo }),
  });
  if (!response.ok) {
    throw new Error("Failed to upload logo");
  }
  return response.json();
};

export const updateRestaurantStatus = async (isClosed: boolean) => {
  const token = await getAuth();
  const isGuest = token?.startsWith("guest_") || isGuestSession();
  if (isGuest) {
    GUEST_VENDOR_USER.restaurant.isClosed = isClosed;
    return { ...GUEST_VENDOR_USER.restaurant, isClosed };
  }

  const response = await fetch(`${API_URL}/users/update-restaurant-status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    },
    body: JSON.stringify({ isClosed }),
  });
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || "Failed to update store status");
  }
  return response.json();
};