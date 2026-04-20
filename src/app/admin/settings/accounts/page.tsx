import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";

const AccountSettings = () => {
  return (
    <section className="bg-card rounded-xl border shadow-sm p-6">
      <h1 className="text-3xl font-bold tracking-tight mb-8">
        Account Settings
      </h1>
      <div className="flex items-center gap-6">
        <Image
          src={
            "https://images.unsplash.com/photo-1506863530036-1efeddceb993?q=80&w=1044&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          alt="profile"
          width={80}
          height={80}
          className="rounded-full aspect-square object-cover border-2 border-primary/20"
        />
        <div className="space-y-2">
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              Change Logo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              Remove
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            supports PNGs, JPEGs and GIFs under 2MB
          </p>
        </div>
      </div>

      <div className="flex gap-2 items-center mt-4 bg-card">
        <label>Restaurant</label>
        <Input />
      </div>
    </section>
  );
};

export default AccountSettings;
