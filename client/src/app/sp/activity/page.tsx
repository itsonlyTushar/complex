"use client"

import { useState } from "react"
import {
  Field,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { toast } from "@/lib/toast"
import { useGetFoodCourts } from "@/hooks/queries/useSpQuery"
import { useEditFoodCourt, useDeleteFoodCourt } from "@/hooks/mutations/useSpMutation"
import { EditingFormState } from "@/types/sp.types"

const Activity = () => {
  const { data: courts = [], isLoading } = useGetFoodCourts();
  const editMutation = useEditFoodCourt();
  const deleteMutation = useDeleteFoodCourt();
  const [editingCourt, setEditingCourt] = useState<EditingFormState | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this food court? This will delete all restaurants, menus, tables, and users associated with it.")) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Food Court deleted successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error(error, "Failed to delete food court.");
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourt) return;

    try {
      await editMutation.mutateAsync({ id: editingCourt.id, data: editingCourt });
      toast.success("Food Court updated successfully!");
      setEditingCourt(null);
    } catch (error: any) {
      console.error(error);
      toast.error(error, "Failed to update food court.");
    }
  };

  const isSaving = editMutation.isPending;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <main className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Court Activity</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View, edit, and delete existing food courts.
        </p>
      </main>

      <section className="mt-6">
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="p-4 border-b font-medium">Name</th>
                <th className="p-4 border-b font-medium">Admin Name</th>
                <th className="p-4 border-b font-medium">Admin Email</th>
                <th className="p-4 border-b font-medium">Location</th>
                <th className="p-4 border-b font-medium">Currency</th>
                <th className="p-4 border-b font-medium">Payment System</th>
                <th className="p-4 border-b font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    Loading food courts...
                  </td>
                </tr>
              ) : courts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    No food courts onboarded yet.
                  </td>
                </tr>
              ) : (
                courts.map((court) => {
                  const admin = court.admins?.[0];
                  return (
                    <tr key={court.id} className="hover:bg-muted/50 transition-colors">
                      <td className="p-4 border-b font-medium">{court.name}</td>
                      <td className="p-4 border-b">{admin?.name || "-"}</td>
                      <td className="p-4 border-b">{admin?.email || "-"}</td>
                      <td className="p-4 border-b">{court.location || "-"}</td>
                      <td className="p-4 border-b">{court.currancy}</td>
                      <td className="p-4 border-b capitalize">{court.paymentSystem}</td>
                      <td className="p-4 border-b">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setEditingCourt({
                                id: court.id,
                                foodCourtName: court.name,
                                email: admin?.email || "",
                                managementDetails: admin?.name || "",
                                location: court.location || "",
                                currancy: court.currancy,
                                paymentSystem: court.paymentSystem
                              })
                            }
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(court.id)}
                            disabled={deleteMutation.isPending}
                          >
                            {deleteMutation.isPending && deleteMutation.variables === court.id
                              ? "Deleting..."
                              : "Delete"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      <Dialog open={editingCourt !== null} onOpenChange={(open) => !open && setEditingCourt(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Food Court</DialogTitle>
            <DialogDescription>
              Update the details for this food court below.
            </DialogDescription>
          </DialogHeader>

          {editingCourt && (
            <form onSubmit={handleSaveEdit} className="space-y-4 py-4">
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <Field>
                    <FieldLabel htmlFor="edit-name">Name</FieldLabel>
                    <Input
                      id="edit-name"
                      type="text"
                      value={editingCourt.foodCourtName}
                      onChange={(e) =>
                        setEditingCourt({ ...editingCourt, foodCourtName: e.target.value })
                      }
                      required
                    />
                  </Field>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Field>
                    <FieldLabel htmlFor="edit-mgmt">Management Details</FieldLabel>
                    <Input
                      id="edit-mgmt"
                      type="text"
                      value={editingCourt.managementDetails}
                      onChange={(e) =>
                        setEditingCourt({ ...editingCourt, managementDetails: e.target.value })
                      }
                      required
                    />
                  </Field>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Field>
                    <FieldLabel htmlFor="edit-email">Admin Email</FieldLabel>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editingCourt.email}
                      onChange={(e) =>
                        setEditingCourt({ ...editingCourt, email: e.target.value })
                      }
                      required
                    />
                  </Field>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Field>
                    <FieldLabel htmlFor="edit-location">Location</FieldLabel>
                    <Input
                      id="edit-location"
                      type="text"
                      value={editingCourt.location}
                      onChange={(e) =>
                        setEditingCourt({ ...editingCourt, location: e.target.value })
                      }
                      required
                    />
                  </Field>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Field>
                    <FieldLabel>Currency</FieldLabel>
                    <Select
                      onValueChange={(val) =>
                        setEditingCourt({ ...editingCourt, currancy: val })
                      }
                      value={editingCourt.currancy}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Field>
                    <FieldLabel>Payment System</FieldLabel>
                    <Select
                      onValueChange={(val) =>
                        setEditingCourt({ ...editingCourt, paymentSystem: val })
                      }
                      value={editingCourt.paymentSystem}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Payment System" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stripe">Stripe</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setEditingCourt(null)} disabled={isSaving}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Activity