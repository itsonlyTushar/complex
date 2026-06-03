"use client";

import { Menu } from "@/types/menu.types";
import { DataTable } from "../payments/data-table";
import { getColumns } from "./columns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle, Loader2, ImagePlus, X } from "lucide-react";
import { menuFormFields } from "@/constants/formFields";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MenuInput, newMenuSchema } from "@/lib/schemas";
import { Textarea } from "@/components/ui/textarea";
import { useGetCategories, useGetMenus } from "@/hooks/queries/useMenuQuery";
import { useAddMenu, useUpdateMenu, useDeleteMenu } from "@/hooks/mutations/useMenuMutation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/lib/toast";

export default function AdminMenuPage() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<Menu | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<Menu | null>(null);

  const { data: categories = [], isLoading: isCategoriesLoading } = useGetCategories();
  const { data: menus = [], isLoading: isMenusLoading } = useGetMenus();

  const { mutateAsync: addMenuMutation, isPending: isAdding } = useAddMenu();
  const { mutateAsync: updateMenuMutation, isPending: isUpdating } = useUpdateMenu();
  const { mutateAsync: deleteMenuMutation } = useDeleteMenu();

  // React Hook Form configs
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<MenuInput>({
    resolver: zodResolver(newMenuSchema) as any,
  });

  const handleAddNewClick = () => {
    setEditingItem(null);
    reset({
      itemName: "",
      category: "",
      price: undefined,
      cost: undefined,
      quantity: undefined,
      description: "",
      image: "",
    });
    setImagePreview(null);
    setIsOpen(true);
  };

  const handleEditClick = (item: Menu) => {
    setEditingItem(item);
    reset({
      itemName: item.itemName,
      category: item.category,
      price: item.price,
      cost: item.cost,
      quantity: item.quantity,
      description: item.description,
      image: item.image || "",
    });
    setImagePreview(item.image || null);
    setIsOpen(true);
  };

  const handleDeleteMenu = (item: Menu) => {
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteMenuMutation({ id: itemToDelete.id });
      toast.success("Menu item deleted successfully!");
    } catch (error: any) {
      console.error("Failed to delete menu item:", error);
      toast.error(error, "Failed to delete item.");
    } finally {
      setItemToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };

  const onSubmit = async (values: MenuInput) => {
    try {
      if (editingItem) {
        await updateMenuMutation({
          ...editingItem,
          ...values,
          image: values.image || "",
        });
        toast.success("Menu item updated successfully!");
      } else {
        await addMenuMutation(values);
        toast.success("Menu item added successfully!");
      }

      reset();
      setImagePreview(null);
      setIsOpen(false);
      setEditingItem(null);
    } catch (error: any) {
      console.error("Failed to save menu item:", error);
      toast.error(error, "Something went wrong.");
    }
  };

  const columns = getColumns(handleEditClick, handleDeleteMenu);

  return (
    <>
      <section className="my-4 text-3xl flex items-center justify-between">
        <div>
          <h1>Menu</h1>
          <p className="text-sm mt-2 text-left text-muted-foreground">
            Manage Menu and Stock from here
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setEditingItem(null);
            reset();
            setImagePreview(null);
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNewClick}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px] max-h-[85vh] flex flex-col gap-0 p-0 overflow-hidden">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col max-h-[85vh]"
            >
              <DialogHeader className="p-6 pb-4 border-b">
                <DialogTitle>{editingItem ? "Edit Menu Item" : "Add New Menu"}</DialogTitle>
                <DialogDescription>
                  {editingItem ? "Edit the details of this existing menu item." : "Add new items to the existing list of your menu."}
                </DialogDescription>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto p-6 py-4 max-h-[calc(85vh-160px)]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 flex items-center justify-between gap-4 rounded-xl border bg-muted/10 p-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-foreground">Menu Item Image</span>
                      <span className="text-xs text-muted-foreground">Supports JPG, PNG (Max 5MB)</span>
                    </div>
                    <div
                      onClick={() => document.getElementById("menu-image")?.click()}
                      className="group relative flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-dashed border-muted-foreground/30 bg-card transition-all duration-300 hover:border-primary/50 hover:bg-primary/[0.02]"
                    >
                      <input
                        id="menu-image"
                        type="file"
                        accept=".jpg, .jpeg, .png"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const resultStr = reader.result as string;
                              setImagePreview(resultStr);
                              setValue("image", resultStr);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      {imagePreview ? (
                        <div className="relative h-full w-full overflow-hidden rounded-xl">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setImagePreview(null);
                                setValue("image", undefined);
                              }}
                              className="rounded-full bg-destructive p-1.5 text-destructive-foreground shadow-md hover:scale-110 transition-transform"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                          <ImagePlus className="h-5 w-5" />
                          <span className="mt-1 text-[10px] font-medium uppercase tracking-wider">Add</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {menuFormFields.map((field) => (
                    <div
                      key={field.name}
                      className={
                        field.name === "itemName" || field.type === "textarea"
                          ? "col-span-2"
                          : "col-span-1"
                      }
                    >
                      <Field>
                        <FieldLabel htmlFor={field.name}>
                          {field.label}
                        </FieldLabel>
                        {field.name === "category" ? (
                          <Controller
                            name="category"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <Select onValueChange={onChange} value={value || ""}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {isCategoriesLoading ? (
                                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                                  ) : categories.length === 0 ? (
                                    <SelectItem value="none" disabled>No categories found</SelectItem>
                                  ) : (
                                    categories.map((cat: any) => (
                                      <SelectItem key={cat.id || cat.name} value={cat.name}>
                                        {cat.name}
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        ) : field.type === "textarea" ? (
                          <Textarea
                            id={field.name}
                            placeholder={`Enter ${field.label.toLowerCase()}...`}
                            {...register(field.name)}
                            className="min-h-[80px]"
                          />
                        ) : (
                          <Input
                            id={field.name}
                            type={field.type}
                            placeholder={`Enter ${field.label.toLowerCase()}...`}
                            {...register(field.name)}
                          />
                        )}
                      </Field>
                      {errors[field.name] && (
                        <FieldError>{errors[field.name]?.message}</FieldError>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 p-6 pt-4 border-t bg-muted/20">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isAdding || isUpdating}>
                  {isAdding || isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      {editingItem ? "Saving..." : "Adding..."}
                    </>
                  ) : (
                    editingItem ? "Save Changes" : "Add Item"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </section>

      <section className="mt-6">
        {isMenusLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <DataTable columns={columns} data={menus} />
        )}
      </section>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{itemToDelete?.itemName}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} variant="destructive">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
