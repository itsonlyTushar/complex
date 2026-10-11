import { getAuth } from "@/app/actions/auth";
import { Category, Menu } from "@/types/menu.types";
import { API_URL } from "@/lib/api";
import {
  GUEST_CATEGORIES,
  GUEST_MENUS,
  isGuestSession,
} from "@/lib/guest-data";

export const fetchCategories = async (): Promise<Category[]> => {
  const token = await getAuth();
  const isGuest = token?.startsWith("guest_") || isGuestSession();
  if (isGuest) {
    return GUEST_CATEGORIES;
  }

  const response = await fetch(`${API_URL}/api/categories`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    },
  });
  if (!response.ok) {
    if (isGuest) return GUEST_CATEGORIES;
    throw new Error("failed to fetch categories");
  }
  return response.json();
};

export const addCategory = async (data: { name: string }): Promise<Category> => {
  const token = await getAuth();
  const isGuest = token?.startsWith("guest_") || isGuestSession();
  if (isGuest) {
    const newCat = {
      id: Date.now(),
      name: data.name,
      restaurantId: "demo-stall-1",
    };
    GUEST_CATEGORIES.push(newCat);
    return newCat;
  }

  const response = await fetch(`${API_URL}/api/add-category`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message || "Failed to create category");
  }
  return response.json();
};

export const updateCategory = async (data: Category): Promise<Category> => {
  const token = await getAuth();
  const isGuest = token?.startsWith("guest_") || isGuestSession();
  if (isGuest) {
    const item = GUEST_CATEGORIES.find((c) => c.id === data.id);
    if (item) item.name = data.name;
    return data;
  }

  const response = await fetch(`${API_URL}/api/update-category`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message || "Failed to update category");
  }
  return response.json();
};

export const deleteCategory = async (data: {
  id: number;
}): Promise<Category> => {
  const token = await getAuth();
  const isGuest = token?.startsWith("guest_") || isGuestSession();
  if (isGuest) {
    const idx = GUEST_CATEGORIES.findIndex((c) => c.id === data.id);
    if (idx !== -1) GUEST_CATEGORIES.splice(idx, 1);
    return { id: data.id, name: "", restaurantId: "demo-stall-1" };
  }

  const response = await fetch(`${API_URL}/api/delete-category`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message || "Failed to delete category");
  }
  return response.json();
};

export const fetchMenus = async (restaurantId?: string): Promise<Menu[]> => {
  const token = await getAuth();
  const isGuest = token?.startsWith("guest_") || isGuestSession();
  if (isGuest || (restaurantId && restaurantId.startsWith("demo-stall"))) {
    return GUEST_MENUS;
  }

  const url = restaurantId
    ? `${API_URL}/api/menus?restaurantId=${restaurantId}`
    : `${API_URL}/api/menus`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    },
  });
  if (!response.ok) {
    if (isGuest || (restaurantId && restaurantId.startsWith("demo-stall"))) return GUEST_MENUS;
    throw new Error("failed to fetch menus");
  }
  return response.json();
};

export const addMenu = async (data: Omit<Menu, "id">): Promise<Menu> => {
  const token = await getAuth();
  const isGuest = token?.startsWith("guest_") || isGuestSession();
  if (isGuest) {
    const newItem: Menu = {
      ...data,
      id: Date.now(),
    };
    GUEST_MENUS.unshift(newItem);
    return newItem;
  }

  const response = await fetch(`${API_URL}/api/add-menu`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message || "Failed to create menu item");
  }
  return response.json();
};

export const updateMenu = async (data: Menu): Promise<Menu> => {
  const token = await getAuth();
  const isGuest = token?.startsWith("guest_") || isGuestSession();
  if (isGuest) {
    const idx = GUEST_MENUS.findIndex((m) => m.id === data.id);
    if (idx !== -1) GUEST_MENUS[idx] = data;
    return data;
  }

  const response = await fetch(`${API_URL}/api/update-menu`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message || "Failed to update menu item");
  }
  return response.json();
};

export const deleteMenu = async (data: {
  id: number;
}): Promise<{ id: number }> => {
  const token = await getAuth();
  const isGuest = token?.startsWith("guest_") || isGuestSession();
  if (isGuest) {
    const idx = GUEST_MENUS.findIndex((m) => m.id === data.id);
    if (idx !== -1) GUEST_MENUS.splice(idx, 1);
    return { id: data.id };
  }

  const response = await fetch(`${API_URL}/api/delete-menu`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message || "Error deleting the menu item");
  }
  return response.json();
};