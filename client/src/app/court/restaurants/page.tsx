"use client";

import { DataTable } from "@/app/admin/payments/data-table";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
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
    <div className="flex flex-col gap-5 py-4">
      <section className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-h2">Restaurants</h1>
          <p className="mt-0.5 text-caption text-fg-tertiary">
            Stalls trading in your food court
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="size-4" /> Onboard
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

      <section>
        {isLoading ? (
          <div className="flex min-h-[200px] w-full items-center justify-center rounded-xl border bg-card p-12">
            <Spinner className="size-6 text-fg-tertiary" />
          </div>
        ) : isError ? (
          <div
            role="alert"
            className="rounded-xl border border-state-late/30 bg-state-late-bg px-4 py-6 text-center"
          >
            <p className="text-body font-medium text-state-late">
              Couldn&apos;t load restaurants
            </p>
            <p className="mx-auto mt-1 max-w-md text-caption text-fg-secondary">
              {error?.message || "The service didn't respond."}
            </p>
          </div>
        ) : (
          <DataTable columns={columns} data={Restaurants || []} />
        )}
      </section>
    </div>
  );
}

export default RestaurantsPage;
