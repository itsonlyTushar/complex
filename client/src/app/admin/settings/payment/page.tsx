"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useGetMe } from "@/hooks/queries/useUserQuery";
import { useUpdateRestaurantStatus } from "@/hooks/mutations/useUserMutation";
import { useOnboardRestaurant, useVerifyOnboarding } from "@/hooks/mutations/usePaymentMutation";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "@/lib/toast";
import { CheckCircle2, AlertCircle, Loader2, CreditCard, ArrowRight, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Payment = () => {
  const { data: user, isLoading: isUserLoading, refetch: refetchUser } = useGetMe();
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateRestaurantStatus();
  const { mutate: onboard, isPending: isOnboarding } = useOnboardRestaurant();
  const { mutate: verify, isPending: isVerifying } = useVerifyOnboarding();
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const status = searchParams.get("status");

  const restaurant = user?.restaurant;
  const isClosed = restaurant?.isClosed ?? true;
  const stripeAccountId = restaurant?.stripeAccountId;
  const onBoradingCompleted = restaurant?.onBoradingCompleted ?? false;

  React.useEffect(() => {
    if (status === "success") {
      verify(undefined, {
        onSuccess: (data) => {
          if (data.completed) {
            toast.success("Stripe account successfully connected!");
          } else {
            toast.warning("Stripe onboarding is incomplete. Please finish all steps.");
          }
          refetchUser();
          router.replace("/admin/settings/payment");
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to verify Stripe onboarding.");
          router.replace("/admin/settings/payment");
        }
      });
    } else if (status === "refresh") {
      toast.info("Stripe session was refreshed.");
      router.replace("/admin/settings/payment");
    }
  }, [status, verify, refetchUser, router]);

  const handleToggleOnlinePayments = (checked: boolean) => {
    updateStatus(!checked);
  };

  const handleConnectStripe = () => {
    onboard(undefined, {
      onSuccess: (data) => {
        if (data.onboardingUrl) {
          window.location.href = data.onboardingUrl;
        } else {
          toast.error("Failed to generate onboarding URL.");
        }
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to initiate Stripe Connect onboarding.");
      }
    });
  };

  if (isUserLoading || isVerifying) {
    return (
      <section className="bg-card rounded-xl border shadow-sm p-6 h-full flex flex-col justify-center items-center py-20 min-h-[300px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground text-sm font-medium">
          {isVerifying ? "Verifying Stripe onboarding..." : "Loading payment settings..."}
        </p>
      </section>
    );
  }

  return (
    <>
      <section className="bg-card rounded-xl border shadow-sm p-6 h-full flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent flex items-center gap-2">
            Payments
          </h1>
        </div>

        <Separator className="my-6 bg-border/60" />

        <div className="grid gap-6 md:grid-cols-2">
          {/* FOR SWITCH  */}
          <div className="flex flex-col justify-between p-5 rounded-xl bg-muted/30 dark:bg-muted/10 border border-border/40 p-6 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="grid gap-1">
                <Label htmlFor="online-payments" className="text-lg font-bold leading-none cursor-pointer">
                  Accept Online Payments
                </Label>

                  <div className="flex items-center gap-2">
                  <p className="font-extrabold border border-emerald-500/20 max-w-sm w-[60px] text-center rounded-xl text-xs bg-emerald-500/10 text-emerald-500">{restaurant?.commissionRate}%</p>
                  <span className="text-xs text-mutated">fee is charged per order.</span>
                  </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/30">
              <span className="text-sm font-semibold text-muted-foreground">
                {!onBoradingCompleted ? "Requires Stripe Connect" : isClosed ? "Status: Disabled" : "Status: Active"}
              </span>
              <Switch
                id="online-payments"
                checked={onBoradingCompleted && !isClosed}
                onCheckedChange={handleToggleOnlinePayments}
                disabled={!onBoradingCompleted || isUpdatingStatus}
              />
            </div>
          </div>

          {/* FOR ACTIVATTION  */}
          <div className="flex flex-col justify-between p-5 rounded-xl bg-muted/30 dark:bg-muted/10 border border-border/40 p-6 mb-8">
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-bold">Stripe Connect</h3>
                </div>
                {onBoradingCompleted ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <CheckCircle2 className="h-3 w-3" /> Connected
                  </span>
                ) : stripeAccountId ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    <AlertCircle className="h-3 w-3" /> Pending Onboarding
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">
                    Not Connected
                  </span>
                )}
              </div>

              {stripeAccountId && (
                <div className="mt-2 p-3 bg-card border border-border/30 rounded-xl">
                  <p className="text-xs text-muted-foreground font-mono truncate">
                    Account ID: <span className="text-foreground select-all">{stripeAccountId}</span>
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6">
              {onBoradingCompleted ? (
                <Button
                  onClick={handleConnectStripe}
                  disabled={isOnboarding}
                  className="w-full rounded-xl flex items-center justify-center gap-2"
                >
                  {isOnboarding ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Manage Stripe Account <ExternalLink className="h-4 w-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleConnectStripe}
                  disabled={isOnboarding}
                  className="w-full rounded-xl flex items-center justify-center gap-2 font-semibold shadow-sm shadow-primary/20"
                >
                  {isOnboarding ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {stripeAccountId ? "Complete Onboarding" : "Connect with Stripe"}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Payment;
