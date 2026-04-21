"use client";

import { Menu } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Menu>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "cost",
    header: "Cost",
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
];
