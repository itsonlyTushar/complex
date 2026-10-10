import { getAuth } from "@/app/actions/auth";
import { Table, Line, PlacedItem } from "@/types/table.types";
import { API_URL } from "@/lib/api";
import {
  GUEST_LAYOUT,
  GUEST_TABLES,
  isGuestSession,
} from "@/lib/guest-data";

export interface SaveLayoutPayload {
  walls: Line[];
  infrastructure: PlacedItem[];
  placedTables: { id: number; x: number; y: number; rotation: number }[];
}

export interface GetLayoutResponse {
  layout: {
    walls: Line[];
    infrastructure: PlacedItem[];
  } | null;
  tables: Table[];
}

export const addTable = async (data: Table): Promise<Table> => {
  const token = await getAuth();
  const isGuest = token?.startsWith("guest_") || isGuestSession();
  if (isGuest) {
    const newTable = {
      ...data,
      id: Date.now(),
    };
    GUEST_TABLES.push(newTable);
    return newTable;
  }

  const response = await fetch(`${API_URL}/api/add-table`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message || "Failed to create table");
  }
  return response.json();
};

export const getTables = async (): Promise<Table[]> => {
  const token = await getAuth();
  const isGuest = token?.startsWith("guest_") || isGuestSession();
  if (isGuest) {
    return GUEST_TABLES;
  }

  const response = await fetch(`${API_URL}/api/get-tables`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    },
  });

  if (!response.ok) {
    if (isGuest) return GUEST_TABLES;
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message || "Failed to fetch tables");
  }
  return response.json();
};

export const saveLayout = async (
  payload: SaveLayoutPayload,
): Promise<{ message: string }> => {
  const token = await getAuth();
  const isGuest = token?.startsWith("guest_") || isGuestSession();
  if (isGuest) {
    GUEST_LAYOUT.layout = {
      walls: payload.walls,
      infrastructure: payload.infrastructure,
    };
    return { message: "Layout updated in guest demo session" };
  }

  const response = await fetch(`${API_URL}/api/save-layout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message || "Failed to save layout");
  }
  return response.json();
};

export const getLayout = async (): Promise<GetLayoutResponse> => {
  const token = await getAuth();
  const isGuest = token?.startsWith("guest_") || isGuestSession();
  if (isGuest) {
    return GUEST_LAYOUT;
  }

  const response = await fetch(`${API_URL}/api/get-layout`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    },
  });

  if (!response.ok) {
    if (isGuest) return GUEST_LAYOUT;
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message || "Failed to fetch layout");
  }
  return response.json();
};
