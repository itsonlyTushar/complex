import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { deleteRestaurant, editRestaurant } from "@/services/court.service";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const ActionsCell = ({ restaurant }: { restaurant: any }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(restaurant.name);
  const [editLocation, setEditLocation] = useState(restaurant.location || "");
  const [isClosed, setIsClosed] = useState(restaurant.isClosed);
  const [isEditOpen, setIsEditOpen] = useState(false);

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

  const handleEdit = async () => {
    setIsEditing(true);
    try {
      await editRestaurant(restaurant.id, { name: editName, location: editLocation, isClosed });
      queryClient.invalidateQueries({ queryKey: COURT_KEYS.restaurants() });
      toast.success(`${restaurant.name} updated successfully!`);
      setIsEditOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update restaurant");
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Restaurant</DialogTitle>
            <DialogDescription>
              Update the details for <strong>{restaurant.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="space-y-2">
               <Label>Name</Label>
               <Input 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)} 
               />
            </div>
            <div className="space-y-2">
               <Label>Location</Label>
               <Input 
                  value={editLocation} 
                  onChange={(e) => setEditLocation(e.target.value)} 
               />
            </div>
            <div className="flex items-center justify-between gap-2 rounded-lg border p-4">
               <div className="space-y-0.5">
                 <Label>Status</Label>
                 <div className="text-sm text-muted-foreground">
                   {isClosed ? "Restaurant is currently closed." : "Restaurant is currently active."}
                 </div>
               </div>
               <Switch 
                  checked={!isClosed} 
                  onCheckedChange={(checked) => setIsClosed(!checked)} 
               />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleEdit} disabled={isEditing}>
              {isEditing ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              variant="destructive"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const id = row.original.id as string;
      return (
        <span className="font-mono text-xs text-muted-foreground" title={id}>
          {id.slice(0, 8)}…
        </span>
      );
    },
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
          className="state-chip rounded-full font-semibold tracking-wide"
          data-state={isClosed ? "late" : "ready"}
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

