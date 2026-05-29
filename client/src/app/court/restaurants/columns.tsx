import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "createdAt",
    header: "Onboard Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString("en-GB").replace(/\//g, "-");
    },
  },
  {
    id: "status",
    header: "Status",
    cell: () => "Active",
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    id: "email",
    header: "Email",
    cell: ({ row }) => {
      const vendors = row.original.vendors;
      return vendors && vendors.length > 0 ? vendors[0].email : "N/A";
    },
  },
  {
    id: "owner",
    header: "Owner/Manager",
    cell: ({ row }) => {
      const vendors = row.original.vendors;
      return vendors && vendors.length > 0 ? vendors[0].name : "N/A";
    },
  },
];
