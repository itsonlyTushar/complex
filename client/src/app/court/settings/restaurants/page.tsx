"use client";

import React, { useState } from "react";
import { useGetRestaurants, COURT_KEYS } from "@/hooks/queries/useCourtQuery";
import { deleteRestaurant } from "@/services/court.service";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Store, Trash2, Calendar, Mail, User, MapPin } from "lucide-react";
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

export default function CourtSettingsRestaurantsPage() {
  const { data: restaurants, isLoading, isError, error } = useGetRestaurants();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const handleDelete = async (restaurant: any) => {
    setDeletingId(restaurant.id);
    try {
      await deleteRestaurant(restaurant.id);
      queryClient.invalidateQueries({ queryKey: COURT_KEYS.restaurants() });
      toast.success(`${restaurant.name} deleted successfully!`);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete restaurant");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="bg-card rounded-xl border shadow-sm p-6 h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Manage Restaurants</h1>
        <p className="text-sm text-muted-foreground">
          View, audit, and delete restaurants registered under your food court.
        </p>
      </div>

      <div className="flex-1">
        {isLoading ? (
          <div className="p-8 text-muted-foreground animate-pulse flex flex-col gap-4">
            <div className="h-20 bg-accent/30 rounded-lg border border-border/50" />
            <div className="h-20 bg-accent/30 rounded-lg border border-border/50" />
          </div>
        ) : isError ? (
          <div className="p-8 text-destructive text-center">
            Failed to load restaurants: {error?.message}
          </div>
        ) : !restaurants || restaurants.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed rounded-xl border-border/50 flex flex-col items-center justify-center gap-4 bg-accent/5">
            <Store className="h-12 w-12 text-muted-foreground/50" />
            <div>
              <p className="text-lg font-semibold text-foreground">No restaurants onboarded</p>
              <p className="text-sm text-muted-foreground">
                Onboard restaurants from the Restaurants sidebar tab.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {restaurants.map((restaurant: any) => {
              const vendor = restaurant.vendors && restaurant.vendors.length > 0 ? restaurant.vendors[0] : null;
              const date = new Date(restaurant.createdAt).toLocaleDateString("en-GB").replace(/\//g, "-");

              return (
                <div
                  key={restaurant.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-accent/10 border border-border/60 hover:bg-accent/20 transition-colors"
                >
                  <div className="grid gap-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <Store className="h-4.5 w-4.5 text-primary" />
                        {restaurant.name}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide ${
                          restaurant.isClosed
                            ? "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30"
                        }`}
                      >
                        {restaurant.isClosed ? "Closed" : "Active"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{restaurant.location || "No Location"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Onboarded: {date}</span>
                      </div>
                      {vendor && (
                        <>
                          <div className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5" />
                            <span>{vendor.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5 animate-none" />
                            <span>{vendor.email}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex items-center gap-2 font-medium"
                          disabled={deletingId === restaurant.id}
                        >
                          <Trash2 size={15} />
                          <span>Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Restaurant</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete <strong>{restaurant.name}</strong>? This action is permanent and cannot be undone. All menu items, categories, and vendors associated with this restaurant will be permanently deleted.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(restaurant)}
                            className="bg-destructive hover:bg-destructive/90 text-white"
                          >
                            {deletingId === restaurant.id ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
