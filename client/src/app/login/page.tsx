"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleLogin(data: any) {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
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

      const role = result.user.role;
      if (role === "SUPER_ADMIN") {
        router.push("/sp");
      } else if (role === "FOOD_COURT_ADMIN") {
        router.push("/court");
      } else if (role === "RESTAURANT_VENDOR") {
        router.push("/admin");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="min-h-screen flex items-center justify-center text-center"
      onSubmit={handleSubmit(handleLogin)}
    >
      <div className="border max-w-md w-full px-6 rounded-xl shadow-sm py-10 bg-card flex flex-col items-center">
        <div className="py-5">
          <span className="text-2xl font-bold">Logo Holder</span>
        </div>

        <div className="flex flex-col gap-4 my-4 w-full text-left">
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              required
              {...register("email")}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              required
              {...register("password")}
            />
          </Field>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <Button type="submit" className="w-full mt-2" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </div>
    </form>
  );
}
