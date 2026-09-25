"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useConnectRazorpay, useDisconnectRazorpay } from "@/hooks/mutations/usePaymentMutation";
import { toast } from "@/lib/toast";
import { CheckCircle2, Loader2 } from "lucide-react";

export function RazorpayConnectCard({ keyId }: { keyId?: string | null }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newKeyId, setNewKeyId] = useState("");
  const [keySecret, setKeySecret] = useState("");

  const { mutate: connect, isPending: isConnecting } = useConnectRazorpay();
  const { mutate: disconnect, isPending: isDisconnecting } = useDisconnectRazorpay();

  const isConnected = !!keyId;
  const showForm = !isConnected || isEditing;
  const mode = keyId?.startsWith("rzp_live_") ? "Live" : "Test";

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    connect(
      { keyId: newKeyId.trim(), keySecret: keySecret.trim() },
      {
        onSuccess: () => {
          toast.success("Razorpay connected. Customers can now pay you directly.");
          setIsEditing(false);
          setNewKeyId("");
          setKeySecret("");
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const handleDisconnect = () => {
    disconnect(undefined, {
      onSuccess: () => toast.success("Razorpay disconnected."),
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div className="flex flex-col justify-between p-5 rounded-xl bg-muted/30 dark:bg-muted/10 border border-border/40 p-6 mb-8">
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold">Razorpay</h3>
            <p className="text-xs text-muted-foreground">
              Payments go straight into your own Razorpay account.
            </p>
          </div>
          {isConnected ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold bg-state-ready-bg text-state-ready border border-state-ready/30">
              <CheckCircle2 className="h-3 w-3" /> Connected · {mode}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold bg-foreground text-fg-tertiary border border-border-strong">
              Not Connected
            </span>
          )}
        </div>

        {isConnected && !isEditing && (
          <div className="mt-2 p-3 bg-card border border-border/30 rounded-xl">
            <p className="text-xs text-muted-foreground font-mono truncate">
              Key ID: <span className="text-foreground select-all">{keyId}</span>
            </p>
          </div>
        )}
      </div>

      {showForm ? (
        <form onSubmit={handleConnect} className="mt-4 flex flex-col gap-3">
          <p className="text-xs text-muted-foreground">
            Find these in your Razorpay Dashboard under Account &amp; Settings → API Keys.
          </p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="razorpay-key-id" className="text-sm font-semibold">Key ID</Label>
            <Input
              id="razorpay-key-id"
              placeholder="rzp_live_..."
              value={newKeyId}
              onChange={(e) => setNewKeyId(e.target.value)}
              disabled={isConnecting}
              autoComplete="off"
              className="rounded-xl font-mono"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="razorpay-key-secret" className="text-sm font-semibold">Key Secret</Label>
            <Input
              id="razorpay-key-secret"
              type="password"
              value={keySecret}
              onChange={(e) => setKeySecret(e.target.value)}
              disabled={isConnecting}
              autoComplete="new-password"
              className="rounded-xl font-mono"
            />
          </div>
          <div className="flex gap-2 mt-2">
            {isEditing && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={isConnecting}
                className="rounded-xl"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isConnecting || !newKeyId.trim() || !keySecret.trim()}
              className="flex-1 rounded-xl font-semibold"
            >
              {isConnecting ? <Loader2 className="h-4 w-4 animate-spin" /> : isEditing ? "Save keys" : "Connect Razorpay"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="mt-6 flex gap-2">
          <Button variant="outline" onClick={() => setIsEditing(true)} className="flex-1 rounded-xl">
            Update keys
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" disabled={isDisconnecting} className="rounded-xl text-destructive hover:text-destructive">
                Disconnect
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Disconnect Razorpay?</AlertDialogTitle>
                <AlertDialogDescription>
                  Customers won&apos;t be able to pay online until you connect again, and Razorpay only
                  shows a key secret once, so reconnecting may mean generating new keys.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDisconnect} variant="destructive">
                  Disconnect
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}
