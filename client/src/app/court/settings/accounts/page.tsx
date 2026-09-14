"use client";

import React from "react";
import { useGetMe } from "@/hooks/queries/useUserQuery";
import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { User, Mail, Shield, LogOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

export default function AccountsPage() {
  const { data: user, isLoading, isError } = useGetMe();

  if (isLoading) {
    return <div className="p-8 text-muted-foreground animate-pulse">Loading account details...</div>;
  }

  if (isError || !user) {
    return <div className="p-8 text-destructive">Failed to load account details.</div>;
  }

  return (
    <section className="bg-card rounded-xl border shadow-sm p-6 h-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Account Settings</h1>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="destructive" 
              className="flex items-center gap-2"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                You will be signed out of your account and redirected to the login page.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button variant="destructive" onClick={() => logout()}>
                Sign Out
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row flex-wrap gap-4">
        
        {/* Full Name */}
        <div className="flex items-center gap-4 p-4 rounded-lg bg-accent/30 border border-border/50 w-full md:max-w-md">
          <div className="p-2 bg-background rounded-full shadow-sm border border-border/50">
            <User size={20} className="text-muted-foreground" />
          </div>
          <div className="grid gap-1.5 leading-none">
            <h3 className="text-sm font-semibold leading-none">Full Name</h3>
            <p className="text-sm text-muted-foreground">
              {user.name}
            </p>
          </div>
        </div>

        {/* Email Address */}
        <div className="flex items-center gap-4 p-4 rounded-lg bg-accent/30 border border-border/50 w-full md:max-w-md">
          <div className="p-2 bg-background rounded-full shadow-sm border border-border/50">
            <Mail size={20} className="text-muted-foreground" />
          </div>
          <div className="grid gap-1.5 leading-none">
            <h3 className="text-sm font-semibold leading-none">Email Address</h3>
            <p className="text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>

        {/* Account Role */}
        <div className="flex items-center gap-4 p-4 rounded-lg bg-accent/30 border border-border/50 w-full md:max-w-md">
          <div className="p-2 bg-background rounded-full shadow-sm border border-border/50">
            <Shield size={20} className="text-muted-foreground" />
          </div>
          <div className="grid gap-1.5 leading-none">
            <h3 className="text-sm font-semibold leading-none">Account Role</h3>
            <p className="text-sm text-muted-foreground font-medium uppercase text-primary">
              {user.role.replace(/_/g, ' ')}
            </p>
          </div>
        </div>
        
      </div>
    </section>
  );
}
