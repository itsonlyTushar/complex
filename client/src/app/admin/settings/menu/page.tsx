"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { FolderPlus, Hash } from "lucide-react";
import { Category } from "@/types/menu.types";
import { useGetCategories } from "@/hooks/queries/useMenuQuery";
import { useAddCategory, useUpdateCategory, useDeleteCategory } from "@/hooks/mutations/useMenuMutation";
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
import { toast } from "@/lib/toast";

export default function MenuSettingsPage() {
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [updatedCategory, setUpdatedCategory] = useState<string>("")
  const [isEditing, setIsEditing] = useState<boolean>(false) 
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const { data: categories = [], isLoading: loading } = useGetCategories();
  const { mutateAsync: addCategoryMutation, isPending: submitting } = useAddCategory();
  const { mutateAsync: addCategoryUpdate, isPending: updating } = useUpdateCategory();
  const { mutateAsync: deleteCategoryMutation } = useDeleteCategory();

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = newCategoryName.trim();
    if (!trimmedName) {
      toast.warning("Category name cannot be empty.");
      return;
    }

    if (categories.some(cat => cat.name.toLowerCase() === trimmedName.toLowerCase())) {
      toast.warning("This category already exists.");
      return;
    }

    try {
      await addCategoryMutation({ name: trimmedName });
      setNewCategoryName("");
      toast.success(`Category "${trimmedName}" added successfully!`);
    } catch (err: any) {
      console.error("Create category error:", err);
      toast.error(err, "Something went wrong. Please try again.");
    }
  };
 
  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingCategory) return;

    const trimmedCat = updatedCategory.trim();
    if (!trimmedCat) {
      toast.warning("Category name cannot be empty.");
      return;
    }

    if (categories.some(cat => cat.name.toLowerCase() === trimmedCat.toLowerCase() && cat.id !== editingCategory.id)) {
      toast.warning("This category already exists.");
      return;
    }

    try {
      await addCategoryUpdate({ id: editingCategory.id, name: trimmedCat });
      toast.success(`Category successfully updated to "${trimmedCat}"!`);
      setUpdatedCategory("");
      setIsEditing(false);
      setEditingCategory(null);
    } catch (err: any) {
      console.error("Update category error:", err);
      toast.error(err, "Something went wrong. Please try again.");
    }
  };

  const handleDeleteCategory = (cat: Category) => {
    setCategoryToDelete(cat);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategoryMutation({ id: categoryToDelete.id });
      toast.success(`Category "${categoryToDelete.name}" deleted successfully!`);
    } catch (err: any) {
      console.error("Delete category error:", err);
      toast.error(err, "Failed to delete category.");
    } finally {
      setCategoryToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };

  return (
    <section className="bg-card/70 backdrop-blur-lg rounded-2xl border border-border/80 shadow-xl p-8 relative overflow-hidden transition-all duration-300">

      {/* Header Info */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent flex items-center gap-2">
            Category Management
          </h1>
        </div>
      </div>
      <Separator className="my-6 bg-border/60" />
      {/* Create Category Form */}
      <div className="bg-muted/30 dark:bg-muted/10 border border-border/40 rounded-xl p-6 mb-8">
        <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 w-full space-y-2">
            <Label htmlFor="category-input" className="text-xs font-semibold tracking-wider text-muted-foreground">
              Category Name
            </Label>
            <div className="relative">
              <Input
                id="category-input"
                value={newCategoryName}
                onChange={(e) => {
                  setNewCategoryName(e.target.value);
                }}
                placeholder="e.g. Appetizers, Desserts, Beverages"
                disabled={submitting}
                className="w-full bg-background/50 border-border/80 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-lg pl-3 pr-10 transition-all duration-300"
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-6 py-2 h-10 font-medium bg-primary hover:bg-primary/95 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 shrink-0"
          >
            {submitting ? (
              <>
                <Spinner className="mr-2 text-primary-foreground animate-spin" />
                Adding...
              </>
            ) : (
              "Add Category"
            )}
          </Button>
        </form>
      </div>

      {/* Existing Categories Display */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground/90 flex items-center gap-2">
            Existing Categories
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 shadow-sm">
            {loading ? "..." : `${categories.length} item${categories.length === 1 ? "" : "s"}`}
          </span>
        </div>

        <div className="border border-border py-2 px-3 rounded-xl max-h-72 overflow-y-auto divide-y divide-border/30">
          {
            categories.map((cat) => {
              const isThisCategoryEditing = isEditing && editingCategory?.id === cat.id;

              return (
                <div 
                  className="flex items-center justify-between py-2.5 hover:bg-muted/10 rounded-lg px-2 transition-all duration-200" 
                  key={cat.id}
                >
                  {isThisCategoryEditing ? (
                    <form onSubmit={handleEditCategory} className="flex flex-1 items-center gap-3">
                      <div className="flex-1 relative">
                        <Input
                          value={updatedCategory}
                          onChange={(e) => {
                            setUpdatedCategory(e.target.value);
                          }}
                          placeholder="Category Name"
                          disabled={updating}
                          className="w-full h-9 bg-background/50 border-border/80 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-lg px-3 transition-all duration-300 text-sm"
                        />
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsEditing(false);
                            setEditingCategory(null);
                            setUpdatedCategory("");
                          }}
                          className="h-8 px-3 text-xs border-border/80 hover:bg-muted/50 rounded-lg"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          size="sm"
                          disabled={updating}
                          className="h-8 px-4 text-xs font-semibold bg-primary hover:bg-primary/95 text-primary-foreground rounded-lg shadow-sm"
                        >
                          {updating ? "Saving..." : "Save"}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <span className="text-sm font-medium text-foreground/80">{cat.name}</span>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingCategory(cat);
                            setUpdatedCategory(cat.name);
                            setIsEditing(true);
                          }}
                          className="h-8 px-3 text-xs font-semibold text-primary hover:text-primary-foreground hover:bg-primary rounded-lg transition-all duration-200 cursor-pointer"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCategory(cat)}
                          className="h-8 px-3 text-xs font-semibold text-destructive hover:text-destructive-foreground hover:bg-destructive rounded-lg transition-all duration-200 cursor-pointer"
                        >
                          Delete
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          }
        </div>
      </div>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete category "{categoryToDelete?.name}"? All associated menu items might lose their category reference. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCategoryToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCategory} variant="destructive">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
