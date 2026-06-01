"use client";

import { DataTable } from "@/app/admin/payments/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { columns } from "./columns";
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
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { restaurantFormFields } from "@/constants/formFields";
import { useGetRestaurants, COURT_KEYS } from "@/hooks/queries/useCourtQuery";
import { onboardRestaurant } from "@/services/court.service";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";

function RestaurantsPage() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  // hook form configrations
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const { data: Restaurants, isLoading, isError, error } = useGetRestaurants();

  const onBoardRestaurant = async (value: SignupInput) => {
    setIsSubmitting(true);
    try {
      await onboardRestaurant(value);

      // Invalidate the cache to automatically refetch the updated list from the server
      queryClient.invalidateQueries({ queryKey: COURT_KEYS.restaurants() });
      reset();
      setOpen(false);
      toast.success("Restaurant onboarded successfully!");
    } catch (error: any) {
      console.error("Onboarding error:", error);
      toast.error(error, "An error occurred while onboarding.");
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
              <form onSubmit={handleSubmit(onBoardRestaurant)}>
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
                        <FieldError>{errors[field.name]?.message}</FieldError>
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
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error: {error?.message}</div>
        ) : (
          <DataTable columns={columns} data={Restaurants || []} />
        )}
      </section>
    </>
  );
}

export default RestaurantsPage;
