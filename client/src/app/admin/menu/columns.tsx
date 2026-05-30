"use client";
import { MdDeleteOutline } from "react-icons/md";
import { MdOutlineEdit } from "react-icons/md";

import { Menu } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Delete, Edit } from "lucide-react";

export const getColumns = (onEdit: (item: Menu) => void, onDelete: (item: Menu) => void): ColumnDef<Menu>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "itemName",
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
    accessorKey: "quantity",
    header: "Stock (Qty)",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const menu = row.original;
      return (
        <div className="flex justify-start items-start gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(menu)}
            className="h-8 px-3 text-xs font-semibold text-primary hover:text-primary-foreground hover:bg-primary rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5"
          >
            <MdOutlineEdit className="h-3.5 w-3.5" /> Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(menu)}
            className="h-8 px-3 text-xs font-semibold text-destructive hover:text-destructive-foreground hover:bg-destructive rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5"
          >
            <MdDeleteOutline className="h-3.5 w-3.5" /> Delete
          </Button>
        </div>
      );
    },
  },
];
