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

async function getData(): Promise<Restaurants[]> {
  return [
    {
      id: "4334WE",
      date: "20-3-2026",
      status: true,
      email: "@gmail.com",
      owner: "Tushar",
    },
  ];
}

function RestaurantsPage() {
  const [data, setData] = useState<Restaurants[]>([]);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getData().then(setData);
  }, []);

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
    console.log("Submitting form with values:", value);
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
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
                {/*TODO: INSERT THE FORM WITH VALIDATION HERE  */}

                <div className="flex flex-col gap-4 py-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm">Name of restaurant</label>
                    <input
                      className="px-1 border py-1 rounded-md outline text-sm focus:outline-2"
                      {...register("restaurantName")}
                    />
                    {errors.restaurantName && (
                      <p className="text-xs text-red-500">
                        {errors.restaurantName.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm">Add Mail</label>
                    <input
                      className="px-1 border py-1 rounded-md outline text-sm focus:outline-2"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm">Owner Name</label>
                    <input
                      className=" px-1 border py-1 rounded-md outline text-sm focus:outline-2"
                      {...register("ownerName")}
                    />
                    {errors.ownerName && (
                      <p className="text-xs text-red-500">
                        {errors.ownerName.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm">Location</label>
                    <input
                      className="px-1 border py-1 rounded-md outline text-sm focus:outline-2"
                      {...register("location")}
                    />
                    {errors.location && (
                      <p className="text-xs text-red-500">
                        {errors.location.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm">Set Password</label>
                    <input
                      type="password"
                      className="px-1 border py-1 rounded-md outline text-sm focus:outline-2"
                      {...register("password")}
                    />
                    {errors.password && (
                      <p className="text-xs text-red-500">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
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
