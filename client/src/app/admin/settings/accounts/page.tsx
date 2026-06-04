"use client";

import React from "react";
import Image from "next/image";
import { useGetMe } from "@/hooks/queries/useUserQuery";
import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
import { useUploadLogo } from "@/hooks/mutations/useUserMutation";

const AccountSettings = () => {
  const { data: user, isLoading, isError } = useGetMe();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { mutate: uploadLogoMutate, isPending: isUploading } = useUploadLogo();
  const [fileError, setFileError] = React.useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setFileError("File size must be under 2MB");
      return;
    }
    setFileError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      uploadLogoMutate(base64String);
    };
    reader.readAsDataURL(file);
  };

  if (isLoading) {
    return <div className="p-8 text-muted-foreground animate-pulse">Loading account details...</div>;
  }

  if (isError || !user) {
    return <div className="p-8 text-destructive">Failed to load account details.</div>;
  }

  return (
    <section className="bg-card rounded-xl border shadow-sm p-6 h-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Account Settings
        </h1>
        
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

      <div className="flex items-center gap-6">
        <Image
          src={
            user.restaurant?.logo || "https://images.unsplash.com/photo-1506863530036-1efeddceb993?q=80&w=1044&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          alt="profile"
          width={80}
          height={80}
          className="rounded-full aspect-square object-cover border-2 border-primary/20"
        />
        <div className="space-y-2">
          <div className="flex gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLogoChange}
              accept="image/*"
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Change Logo"}
            </Button>
            {user.restaurant?.logo && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    disabled={isUploading}
                  >
                    Remove
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Remove Logo</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to remove your profile logo? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button
                        variant="destructive"
                        onClick={() => uploadLogoMutate("")}
                      >
                        Remove Logo
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            supports PNGs, JPEGs and GIFs under 2MB
          </p>
          {fileError && (
            <p className="text-sm font-medium text-destructive mt-1">
              {fileError}
            </p>
          )}
        </div>
      </div>

      <Separator className="my-8" />

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
};

export default AccountSettings;
