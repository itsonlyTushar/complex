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
    cell: ({ row }) => {
      const isClosed = row.original.isClosed;
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${
            isClosed
              ? "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30"
              : "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30"
          }`}
        >
          {isClosed ? "Closed" : "Active"}
        </span>
      );
    },
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
