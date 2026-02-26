"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { Category, ApiResponse } from "@/types/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function GetCategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<ApiResponse<Category[]>>("/categories")
      .then((res) => setCategories(res.data))
      .catch(() => toast.error("Failed to load categories"))
      .finally(() => setLoading(false));
  }, []);

  const handleToggleActive = async (cat: Category) => {
    try {
      await apiFetch(`/categories/${cat.id}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !cat.isActive }),
      });
      toast.success(`Category ${cat.isActive ? "disabled" : "enabled"}`);
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, isActive: !c.isActive } : c))
      );
    } catch {
      toast.error("Failed to update category");
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Total: {categories.length} categories
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/createCategory">
            <Plus className="size-4 mr-1" />
            Add Category
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <Card key={cat.id}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                {cat.icon && <span className="text-2xl">{cat.icon}</span>}
                <CardTitle className="text-base">{cat.name}</CardTitle>
              </div>
              <Badge
                variant={cat.isActive ? "outline" : "secondary"}
                className={cat.isActive ? "text-green-600 border-green-300" : ""}
              >
                {cat.isActive ? "Active" : "Inactive"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {cat.description && (
                <p className="text-sm text-muted-foreground">{cat.description}</p>
              )}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={cat.isActive ? "destructive" : "outline"}
                  onClick={() => handleToggleActive(cat)}
                >
                  {cat.isActive ? "Disable" : "Enable"}
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/admin/updateCategory?id=${cat.id}&name=${cat.name}&description=${cat.description || ""}&icon=${cat.icon || ""}`}>
                    Edit
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}