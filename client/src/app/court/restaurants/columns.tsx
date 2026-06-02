import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { deleteRestaurant } from "@/services/court.service";
import { COURT_KEYS } from "@/hooks/queries/useCourtQuery";
import { toast } from "@/lib/toast";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ActionsCell = ({ restaurant }: { restaurant: any }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteRestaurant(restaurant.id);
      queryClient.invalidateQueries({ queryKey: COURT_KEYS.restaurants() });
      toast.success(`${restaurant.name} deleted successfully!`);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete restaurant");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Restaurant</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{restaurant.name}</strong>? This action cannot be undone. All menu items, categories, and vendors associated with this restaurant will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive hover:bg-destructive/90 text-white"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Restaurant Name",
    cell: ({ row }) => {
      return <span className="font-semibold text-foreground">{row.original.name}</span>;
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
  {
    id: "email",
    header: "Email",
    cell: ({ row }) => {
      const vendors = row.original.vendors;
      return vendors && vendors.length > 0 ? vendors[0].email : "N/A";
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const isClosed = row.original.isClosed;
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${isClosed
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
    accessorKey: "createdAt",
    header: "Onboard Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString("en-GB").replace(/\//g, "-");
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell restaurant={row.original} />,
  },
];

