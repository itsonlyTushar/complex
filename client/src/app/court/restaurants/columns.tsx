import { Restaurants } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Restaurants>[] = [
  {
    accessorKey: "date",
    header: "Onboard Date",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "owner",
    header: "Owner/Manager",
  },
];
