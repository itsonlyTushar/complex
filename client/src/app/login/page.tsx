"use client";

import { useState } from "react";
import { loginAction } from "../actions/auth";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await loginAction(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form
      className="min-h-screen flex items-center justify-center text-center"
      action={handleSubmit}
    >
      <div className="border max-w-md px-2 rounded-xl shadow-sm py-10 bg-card">
        <div className="py-5">
          <span className="text-2xl">Logo Holder</span>
        </div>

        <div className="flex gap-2 my-2">
          <input
            className="border rounded-md px-2 py-2 w-full"
            name="email"
            type="email"
            placeholder="Email"
            required
          />
          <input
            className="border rounded-md px-2 py-2 w-full"
            name="password"
            type="password"
            placeholder="Password"
            required
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </div>
    </form>
  );
}
