"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import type { ApiResponse, Category } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import IconPicker from "@/components/modules/admin/iconpicker";
// import IconPicker from "@/components/modules/admin/IconPicker";

export default function CreateCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    icon: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setLoading(true);
    try {
      await apiFetch<ApiResponse<Category>>("/api/categories", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          description: form.description || undefined,
          icon: form.icon || undefined,
        }),
      });
      toast.success("Category created successfully!");
      router.push("/admin/getCategory");
    } catch {
      toast.error("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create Category</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Add a new subject category for tutors
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Category Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
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
                placeholder="Short description about this category..."
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            {/* ✅ Icon logic সম্পূর্ণ IconPicker component এ */}
            <div className="space-y-2">
              <Label>Icon (Emoji)</Label>
              <IconPicker
                value={form.icon}
                onChange={(icon) => setForm({ ...form, icon })}
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Creating..." : "Create Category"}
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







// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { apiFetch } from "@/lib/api";
// import type { ApiResponse, Category } from "@/types/admin";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { toast } from "sonner";

// export default function CreateCategoryPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     icon: "",
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!form.name.trim()) {
//       toast.error("Category name is required");
//       return;
//     }

//     setLoading(true);
//     try {
//       await apiFetch<ApiResponse<Category>>("/api/categories", {
//         method: "POST",
//         body: JSON.stringify({
//           name: form.name,
//           description: form.description || undefined,
//           icon: form.icon || undefined,
//         }),
//       });
//       toast.success("Category created successfully!");
//       router.push("/admin/getCategory");
//     } catch {
//       toast.error("Failed to create category");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-lg">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold">Create Category</h1>
//         <p className="text-muted-foreground text-sm mt-1">
//           Add a new subject category for tutors
//         </p>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle className="text-base">Category Details</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div className="space-y-2">
//               <Label htmlFor="name">Category Name *</Label>
//               <Input
//                 id="name"
//                 placeholder="e.g. Mathematics"
//                 value={form.name}
//                 onChange={(e) => setForm({ ...form, name: e.target.value })}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="description">Description</Label>
//               <Textarea
//                 id="description"
//                 placeholder="Short description about this category..."
//                 rows={3}
//                 value={form.description}
//                 onChange={(e) => setForm({ ...form, description: e.target.value })}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="icon">Icon (Emoji)</Label>
//               <Input
//                 id="icon"
//                 placeholder="e.g. 📐"
//                 value={form.icon}
//                 onChange={(e) => setForm({ ...form, icon: e.target.value })}
//               />
//               <p className="text-xs text-muted-foreground">
//                 Use an emoji as the category icon
//               </p>
//             </div>

//             <div className="flex gap-3">
//               <Button type="submit" disabled={loading} className="flex-1">
//                 {loading ? "Creating..." : "Create Category"}
//               </Button>
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => router.push("/admin/getCategory")}
//               >
//                 Cancel
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }