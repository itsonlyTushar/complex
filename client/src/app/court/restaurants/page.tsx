"use client";

import { DataTable } from "@/app/admin/payments/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { columns } from "./columns";
import { Restaurants } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupInput } from "@/lib/schemas";
import {
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const restaurantFormFields = [
  {
    name: "restaurantName",
    label: "Name of restaurant",
    type: "text",
  },
  {
    name: "email",
    label: "Add Mail",
    type: "email",
  },
  {
    name: "ownerName",
    label: "Owner Name",
    type: "text",
  },
  {
    name: "location",
    label: "Location",
    type: "text",
  },
  {
    name: "password",
    label: "Set Password",
    type: "password",
  },
] as const;

function RestaurantsPage() {
  const [data, setData] = useState<Restaurants[]>([]);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // hook form configrations
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const onBoardRestaurant = async (value: SignupInput) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to onboard");
      }

      const newUser = result;

      const newEntry: Restaurants = {
        id: newUser.restaurant_id.toString(),
        date: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
        status: true,
        email: value.email,
        owner: value.ownerName,
      };
      setData((prev) => [...prev, newEntry]);
      reset();
      setOpen(false);
      alert("Restaurant onboarded successfully!");
    } catch (error: any) {
      console.error("Onboarding error:", error);
      alert(error.message || "An error occurred while onboarding.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="flex justify-between gap-2 py-6 px-5">
        <h1 className="text-3xl">Restaurants</h1>

        <div className="flex items-center gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="font-bold">
                <Plus size={12} /> Onboard
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form
                onSubmit={handleSubmit(onBoardRestaurant, (err) =>
                  console.log("Validation Errors:", err),
                )}
              >
                <DialogHeader>
                  <DialogTitle>
                    Add New Restaurant in Your Food Court
                  </DialogTitle>
                  <DialogDescription>
                    Onboard your restaurant or shop of the foodcourt
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                  {restaurantFormFields.map((field) => (
                    <div key={field.name} className="flex flex-col gap-1.5">
                      <Field>
                        <FieldLabel htmlFor={field.name}>
                          {field.label}
                        </FieldLabel>
                        <Input
                          id={field.name}
                          type={field.type}
                          placeholder={`Enter ${field.label.toLowerCase()}...`}
                          {...register(field.name)}
                        />
                      </Field>
                      {errors[field.name] && (
                        <FieldError>
                          {errors[field.name]?.message}
                        </FieldError>
                      )}
                    </div>
                  ))}
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <section className="mx-2">
        <DataTable columns={columns} data={data} />
      </section>
    </>
  );
}

export default RestaurantsPage;
