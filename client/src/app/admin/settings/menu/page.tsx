"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import {
  FolderPlus, AlertCircle,
  CheckCircle, Hash
} from "lucide-react";
import { getAuth } from "@/app/actions/auth";
import { Category } from "@/types";

export default function MenuSettingsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>("");

  // Feedback alerts state
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = await getAuth();
        const response = await fetch("http://127.0.0.1:5000/api/categories", {
          headers: {
            "Authorization": `Bearer ${token || ""}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to load categories");
        }

        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error("Fetch categories error:", err);
        setErrorMsg("Failed to load categories. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Form submission handler
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validations
    const trimmedName = newCategoryName.trim();
    if (!trimmedName) {
      setErrorMsg("Category name cannot be empty.");
      return;
    }

    if (categories.some(cat => cat.name.toLowerCase() === trimmedName.toLowerCase())) {
      setErrorMsg("This category already exists.");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const token = await getAuth();
      const response = await fetch("http://127.0.0.1:5000/api/add-category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token || ""}`
        },
        body: JSON.stringify({ name: trimmedName })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create category");
      }

      const newCategory = await response.json();
      setCategories(prev => [...prev, newCategory]);
      setNewCategoryName("");
      setSuccessMsg(`Category "${trimmedName}" added successfully!`);

      // Auto-dismiss success alert after 3.5s
      setTimeout(() => {
        setSuccessMsg(null);
      }, 3500);
    } catch (err: any) {
      console.error("Create category error:", err);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-card/70 backdrop-blur-lg rounded-2xl border border-border/80 shadow-xl p-8 relative overflow-hidden transition-all duration-300">
      {/* Decorative Gradient Background Highlights */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full filter blur-3xl pointer-events-none -z-10" />

      {/* Header Info */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent flex items-center gap-2">
            Category Management
          </h1>
          <p className="text-sm mt-2 text-muted-foreground max-w-lg leading-relaxed">
            Organize your menu items by defining categories.
          </p>
        </div>
      </div>

      <Separator className="my-6 bg-border/60" />

      {/* Error & Success Alert Bars with AnimatePresence */}
      <AnimatePresence mode="wait">
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium shadow-sm"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="flex-1">{errorMsg}</span>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-xs opacity-70 hover:opacity-100 transition-opacity font-bold underline cursor-pointer"
            >
              Dismiss
            </button>
          </motion.div>
        )}

        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium shadow-sm"
          >
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span className="flex-1">{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Category Form */}
      <div className="bg-muted/30 dark:bg-muted/10 border border-border/40 rounded-xl p-6 mb-8 shadow-inner">
        <h2 className="text-lg font-semibold mb-4 text-foreground/90 flex items-center gap-2">
          <FolderPlus className="w-5 h-5 text-primary" />
          Create New Category
        </h2>
        <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 w-full space-y-2">
            <Label htmlFor="category-input" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Category Name
            </Label>
            <div className="relative">
              <Input
                id="category-input"
                value={newCategoryName}
                onChange={(e) => {
                  setNewCategoryName(e.target.value);
                  if (errorMsg) setErrorMsg(null); // Clear errors dynamically as they type
                }}
                placeholder="e.g. Appetizers, Desserts, Beverages"
                disabled={submitting}
                className="w-full bg-background/50 border-border/80 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-lg pl-3 pr-10 transition-all duration-300"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40">
                <Hash className="w-4 h-4" />
              </span>
            </div>
          </div>
          <Button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-6 py-2 h-10 font-medium bg-primary hover:bg-primary/95 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 shrink-0"
          >
            {submitting ? (
              <>
                <Spinner className="mr-2 text-primary-foreground" />
                Adding...
              </>
            ) : (
              "Add Category"
            )}
          </Button>
        </form>
      </div>

      {/* Existing Categories Display */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground/90 flex items-center gap-2">
            Existing Categories
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 shadow-sm">
            {loading ? "..." : `${categories.length} item${categories.length === 1 ? "" : "s"}`}
          </span>
        </div>

        <div className="border border-border py-4 px-2 rounded-xl">
          {
            categories.map((cat) => (
              <div className="" key={cat.id}>
                <span>{cat.name}</span>
              </div>
            ))
          }

        </div>
      </div>
    </section>
  );
}
