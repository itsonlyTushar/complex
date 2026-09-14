"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/lib/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/schemas";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Logo } from "@/components/ui/logo";
import { API_URL } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
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

      toast.success("Welcome back! Login successful.");

      const role = result.user.role;
      if (role === "SUPER_ADMIN") {
        router.push("/sp");
      } else if (role === "FOOD_COURT_ADMIN") {
        router.push("/court");
      } else if (role === "RESTAURANT_VENDOR") {
        router.push("/admin");
      }
    } catch (err: any) {
      toast.error(err, "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between px-4 py-3">
        <Logo />
        <ThemeToggle />
      </header>

      <div className="flex flex-1 items-center justify-center px-4 pb-16">
        <form
          onSubmit={handleSubmit(handleLogin)}
          className="w-full max-w-[380px]"
          noValidate
        >
          <div className="mb-5">
            <h1 className="mt-1.5 text-h2">Log in to Complex</h1>
            <p className="mt-1 text-caption text-fg-tertiary">
              One sign-in for operators, vendors and platform admins. You land in
              the right portal automatically.
            </p>
          </div>

          <div className="flex flex-col gap-4 rounded-xl border bg-card p-4">
            <Field>
              <FieldLabel htmlFor="email">Work email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="you@venue.com"
                autoComplete="email"
                autoFocus
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
          </div>

          <p className="mt-4 text-caption text-fg-tertiary">
            Vendors are invited by their food court operator. Need access?{" "}
            <a
              href="/#operators"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Talk to your operator
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}

