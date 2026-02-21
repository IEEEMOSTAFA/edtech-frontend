"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import type { ApiResponse, Category } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Suspense } from "react";

function UpdateCategoryForm() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id") || "";
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: params.get("name") || "",
    description: params.get("description") || "",
    icon: params.get("icon") || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      toast.error("Category ID missing");
      return;
    }

    setLoading(true);
    try {
      await apiFetch<ApiResponse<Category>>(`/api/categories/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: form.name || undefined,
          description: form.description || undefined,
          icon: form.icon || undefined,
        }),
      });
      toast.success("Category updated successfully!");
      router.push("/admin/getCategory");
    } catch {
      toast.error("Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Update Category</h1>
        <p className="text-muted-foreground text-sm mt-1">Edit category details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Category Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                placeholder="e.g. Mathematics"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Short description..."
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icon (Emoji)</Label>
              <Input
                id="icon"
                placeholder="e.g. 📐"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Updating..." : "Update Category"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/getCategory")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function UpdateCategoryPage() {
  return (
    <Suspense fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
      <UpdateCategoryForm />
    </Suspense>
  );
}