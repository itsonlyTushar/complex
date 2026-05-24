"use client";

import { Menu } from "@/types";
import { DataTable } from "../payments/data-table";
import { columns } from "./columns";
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
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MenuInput, newMenuSchema } from "@/lib/schemas";
import { Textarea } from "@/components/ui/textarea";
import { getAuth } from "@/app/actions/auth";

export default function AdminMenuPage() {
  const [data, setData] = useState<Menu[]>([]);
  const [submitting, setIsSubmitting] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const loadMenus = async () => {
      try {
        const token = await getAuth();
        const response = await fetch("http://127.0.0.1:5000/api/menus", {
          headers: {
            "Authorization": `Bearer ${token || ""}`
          }
        });
        if (response.ok) {
          const list = await response.json();
          setData(list);
        }
      } catch (error) {
        console.error("Failed to load menus:", error);
      }
    };
    loadMenus();
  }, []);

  // React Hook Form configs
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm<MenuInput>({
    resolver: zodResolver(newMenuSchema) as any,
  });

  const addNewItem = async (values: MenuInput) => {
    setIsSubmitting(true);
    try {
      const token = await getAuth();
      const response = await fetch("http://127.0.0.1:5000/api/add-menu", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token || ""}`
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to add menu item");
      }
      const newItem = await response.json();
      setData((prev) => [...prev, newItem]);

      reset();
      setImagePreview(null);
      setIsOpen(false);
      alert("Menu item added successfully!");
    } catch (error) {
      console.error("Failed to add menu item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="my-4 text-3xl flex items-center justify-between">
        <div>
          <h1>Menu</h1>
          <p className="text-sm mt-2 text-left text-muted-foreground">
            Manage Menu and Stock from here
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px] max-h-[85vh] flex flex-col gap-0 p-0 overflow-hidden">
            <form
              onSubmit={handleSubmit(addNewItem)}
              className="flex flex-col max-h-[85vh]"
            >
              <DialogHeader className="p-6 pb-4 border-b">
                <DialogTitle>Add New Menu</DialogTitle>
                <DialogDescription>
                  Add new items to the existing list of your menu.
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
                        {field.type === "textarea" ? (
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
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Adding...
                    </>
                  ) : (
                    "Add Item"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </section>

      <section className="mt-6">
        <DataTable columns={columns} data={data} />
      </section>
    </>
  );
}
