"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/lib/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/schemas";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Logo } from "@/components/ui/logo";
import { API_URL } from "@/lib/api";
import { Store, ChefHat, ArrowRight, Eye } from "lucide-react";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const [loading, setLoading] = useState<boolean>(false);

  async function handleLogin(data: LoginInput) {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Invalid Credentials");
      }

      document.cookie = `token=${result.token}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `user_role=${result.user.role}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `is_guest=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

      toast.success("Welcome back! Login successful.");

      const role = result.user.role;
      const target =
        role === "SUPER_ADMIN"
          ? "/sp"
          : role === "FOOD_COURT_ADMIN"
            ? "/court"
            : "/admin";

      window.location.replace(target);
    } catch (err: any) {
      toast.error(err, "Login failed");
      setLoading(false);
    }
  }

  function handleGuestLogin(
    role: "FOOD_COURT_ADMIN" | "RESTAURANT_VENDOR",
  ) {
    setLoading(true);
    try {
      const guestToken =
        role === "FOOD_COURT_ADMIN"
          ? "guest_token_court"
          : "guest_token_vendor";

      document.cookie = `token=${guestToken}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `user_role=${role}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `is_guest=true; path=/; max-age=86400; SameSite=Lax`;

      const label =
        role === "FOOD_COURT_ADMIN" ? "Food Court" : "Food Court Shop / Stall";
      toast.success(`Entering Guest Mode as ${label}`);

      const target = role === "FOOD_COURT_ADMIN" ? "/court" : "/admin";
      window.location.replace(target);
    } catch (err: any) {
      toast.error(err, "Failed to enter guest mode");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between px-4 py-3 sm:px-6">
        <Logo className="h-7 sm:h-8" />
        <ThemeToggle />
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-[400px]">
          <div className="mb-5">
            <h1 className="mt-1.5 text-h2">Log in to Complex</h1>
            <p className="mt-1 text-caption text-fg-tertiary">
              Sign in to manage your food hall, or enter guest mode below to
              explore the interface with demo data.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(handleLogin)}
            className="flex flex-col gap-4 rounded-xl border bg-card p-4"
            noValidate
          >
            <Field>
              <FieldLabel htmlFor="email">Work email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="you@venue.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              {errors.password && (
                <FieldError>{errors.password.message}</FieldError>
              )}
            </Field>

            <Button type="submit" className="mt-1 w-full" disabled={loading}>
              {loading ? "Signing in…" : "Log in"}
            </Button>
          </form>

          <div className="relative mb-5 text-center mt-5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <span className="relative bg-background px-3 text-micro font-medium uppercase tracking-wider text-fg-tertiary">
              Or sign in with account
            </span>
          </div>

          {/* Guest Mode exploration section */}
          <section
            aria-label="Guest Mode"
            className="mb-5 rounded-xl border border-primary/25 bg-primary/5 p-4"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-caption font-semibold text-fg-primary">
                <Eye className="size-3.5 text-primary" />
                <span>Explore in Guest Mode</span>
              </span>
            </div>
            <p className="mt-1 text-micro text-fg-secondary">
              Instant one-click access to explore the live dashboard with sample
              venues, tables, and orders.
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleGuestLogin("FOOD_COURT_ADMIN")}
                disabled={loading}
                className="group flex flex-col items-start gap-1 rounded-lg border bg-card p-3 text-left transition hover:border-primary hover:shadow-xs disabled:opacity-50"
              >
                <div className="flex w-full items-center justify-between text-primary">
                  <Store className="size-4" />
                  <ArrowRight className="size-3 text-fg-tertiary transition-transform group-hover:translate-x-0.5" />
                </div>
                <div className="mt-1 font-medium text-caption text-fg-primary">
                  Food Court
                </div>
                <div className="text-micro text-fg-tertiary">
                  Operator portal
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleGuestLogin("RESTAURANT_VENDOR")}
                disabled={loading}
                className="group flex flex-col items-start gap-1 rounded-lg border bg-card p-3 text-left transition hover:border-primary hover:shadow-xs disabled:opacity-50"
              >
                <div className="flex w-full items-center justify-between text-primary">
                  <ChefHat className="size-4" />
                  <ArrowRight className="size-3 text-fg-tertiary transition-transform group-hover:translate-x-0.5" />
                </div>
                <div className="mt-1 font-medium text-caption text-fg-primary">
                  Shop / Stall
                </div>
                <div className="text-micro text-fg-tertiary">Vendor portal</div>
              </button>
            </div>
          </section>

          <p className="mt-4 text-caption text-fg-tertiary">
            Vendors are invited by their food court operator. Need access?{" "}
            <a
              href="/#operators"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Talk to your operator
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
