"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Category, TutorProfileForm } from "@/types/tutor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User, DollarSign, Briefcase, BookMarked, Save, Loader2, CheckCircle2,
} from "lucide-react";
import { ProfileToast, Toast } from "@/components/modules/tutor/ProfileToast";
import { ProfileSection } from "@/components/modules/tutor/ProfileSection";
import { ProfileImageUpload } from "@/components/modules/tutor/ProfileImageUpload";

// import { ProfileToast, type Toast } from "@/components/modules/tutor/ProfileToast";
// import { ProfileSection } from "@/components/modules/tutor/ProfileSection";
// import { ProfileImageUpload } from "@/components/modules/tutor/ProfileImageUpload";

export default function TutorProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const [form, setForm] = useState<TutorProfileForm>({
    id: "", bio: "", hourlyRate: 0, experience: 0, categoryIds: [],
  });

  // ── Load categories + profile ──
  useEffect(() => {
    const load = async () => {
      try {
        const [catRes, profileRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tutors/dashboard`, { credentials: "include" }),
        ]);

        const catJson = await catRes.json();
        setCategories(catJson.data ?? []);

        if (profileRes.ok) {
          const { data } = await profileRes.json();
          const profile = data?.tutorProfile;
          if (profile) {
            setForm({
              id: profile.id ?? "",
              bio: profile.bio ?? "",
              hourlyRate: profile.hourlyRate ?? 0,
              experience: profile.experience ?? 0,
              categoryIds: profile.categories?.map((c: Category) => c.id) ?? [],
            });
          }
          setCurrentImage(data?.image ?? null);
        }
      } catch {
        showToast("error", "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Auto-dismiss toast ──
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "hourlyRate" || name === "experience" ? Number(value) : value,
    }));
  }

  function toggleCategory(id: string) {
    setForm((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(id)
        ? prev.categoryIds.filter((c) => c !== id)
        : [...prev.categoryIds, id],
    }));
  }

  async function handleSubmit() {
    setSaving(true);
    try {
      const payload = { ...form, ...(imageBase64 !== null && { image: imageBase64 }) };
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tutors/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast("success", "Profile updated successfully!");
        router.refresh();
      } else {
        showToast("error", "Failed to update profile. Please try again.");
      }
    } catch {
      showToast("error", "Network error. Please check your connection.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm tracking-wide">Loading profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">

        <ProfileToast toast={toast} />

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Tutor Settings
          </p>
          <h1 className="mt-1.5 text-3xl font-black tracking-tight">Edit Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep your profile updated to attract more students.
          </p>
        </div>

        <div className="space-y-5">

          {/* Profile Photo */}
          <ProfileSection icon={User} title="Profile Photo">
            <ProfileImageUpload currentImage={currentImage} onImageChange={setImageBase64} />
          </ProfileSection>

          {/* Bio */}
          <ProfileSection icon={User} title="About You">
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
              <Textarea
                id="bio" name="bio" rows={4} value={form.bio ?? ""}
                placeholder="Tell students about your teaching style, background…"
                onChange={handleChange} className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {(form.bio ?? "").length} / 500 characters recommended
              </p>
            </div>
          </ProfileSection>

          {/* Rate & Experience */}
          <ProfileSection icon={DollarSign} title="Rate & Experience">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="hourlyRate" className="text-sm font-medium">Hourly Rate (USD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                  <Input id="hourlyRate" name="hourlyRate" type="number" min={0} step={0.5}
                    value={form.hourlyRate} onChange={handleChange} className="pl-7" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience" className="text-sm font-medium">Years of Experience</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="experience" name="experience" type="number" min={0} max={50}
                    value={form.experience} onChange={handleChange} className="pl-9" />
                </div>
              </div>
            </div>

            {(form.hourlyRate > 0 || form.experience > 0) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {form.hourlyRate > 0 && (
                  <Badge variant="secondary" className="gap-1.5">
                    <DollarSign className="h-3 w-3" />${form.hourlyRate}/hr
                  </Badge>
                )}
                {form.experience > 0 && (
                  <Badge variant="secondary" className="gap-1.5">
                    <Briefcase className="h-3 w-3" />
                    {form.experience} yr{form.experience !== 1 ? "s" : ""} experience
                  </Badge>
                )}
              </div>
            )}
          </ProfileSection>

          {/* Categories */}
          <ProfileSection icon={BookMarked} title="Teaching Categories">
            <p className="mb-4 text-xs text-muted-foreground">Select all subjects you teach.</p>

            {categories.length === 0 ? (
              <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border py-6 text-sm text-muted-foreground">
                <BookMarked className="h-4 w-4 opacity-40" />
                No categories available
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const selected = form.categoryIds.includes(cat.id);
                  return (
                    <button
                      key={cat.id} type="button" onClick={() => toggleCategory(cat.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-muted/30 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      }`}
                    >
                      {selected && <CheckCircle2 className="h-3.5 w-3.5" />}
                      {cat.icon && <span>{cat.icon}</span>}
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            )}

            {form.categoryIds.length > 0 && (
              <p className="mt-3 text-xs text-muted-foreground">
                {form.categoryIds.length} Categor{form.categoryIds.length !== 1 ? "ies" : "y"} selected
              </p>
            )}
          </ProfileSection>

          {/* Save */}
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-muted-foreground">
              Changes are saved to your public profile immediately.
            </p>
            <Button onClick={handleSubmit} disabled={saving} className="min-w-[130px] gap-2">
              {saving ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Saving…</>
              ) : (
                <><Save className="h-4 w-4" />Save Profile</>
              )}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}






















// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useRouter } from "next/navigation";
// import type { Category, TutorProfileForm } from "@/types/tutor";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Textarea } from "@/components/ui/textarea";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   User,
//   DollarSign,
//   Briefcase,
//   BookMarked,
//   Save,
//   Loader2,
//   CheckCircle2,
//   AlertCircle,
//   Camera,
//   X,
// } from "lucide-react";

// // ─── Toast type ───────────────────────────────────────────────────────────────
// type Toast = { type: "success" | "error"; message: string } | null;

// // ─── Section wrapper ──────────────────────────────────────────────────────────
// function Section({
//   icon: Icon,
//   title,
//   children,
// }: {
//   icon: React.ElementType;
//   title: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
//       <CardHeader className="pb-3 pt-5">
//         <CardTitle className="flex items-center gap-2 text-sm font-semibold">
//           <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
//             <Icon className="h-4 w-4 text-primary" />
//           </div>
//           {title}
//         </CardTitle>
//       </CardHeader>
//       <Separator className="mb-0" />
//       <CardContent className="pt-5 pb-6">{children}</CardContent>
//     </Card>
//   );
// }

// // ─── Image Upload Component ───────────────────────────────────────────────────
// function ImageUpload({
//   currentImage,
//   onImageChange,
// }: {
//   currentImage: string | null;
//   onImageChange: (base64: string | null) => void;
// }) {
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [preview, setPreview] = useState<string | null>(currentImage);
//   const [dragOver, setDragOver] = useState(false);

//   // ── file → base64 converter ──
//   const processFile = (file: File) => {
//     // max 2MB check
//     if (file.size > 2 * 1024 * 1024) {
//       alert("Image must be less than 2MB");
//       return;
//     }
//     // only images
//     if (!file.type.startsWith("image/")) {
//       alert("Please select an image file");
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const base64 = e.target?.result as string;
//       setPreview(base64);
//       onImageChange(base64);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) processFile(file);
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     setDragOver(false);
//     const file = e.dataTransfer.files?.[0];
//     if (file) processFile(file);
//   };

//   const handleRemove = () => {
//     setPreview(null);
//     onImageChange(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   return (
//     <div className="flex flex-col items-center gap-4">
//       {/* Avatar preview */}
//       <div className="relative">
//         <div
//           className={`h-28 w-28 rounded-full border-2 overflow-hidden transition-all ${
//             dragOver ? "border-primary border-dashed" : "border-border"
//           } bg-muted flex items-center justify-center`}
//           onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
//           onDragLeave={() => setDragOver(false)}
//           onDrop={handleDrop}
//         >
//           {preview ? (
//             <img
//               src={preview}
//               alt="Profile"
//               className="h-full w-full object-cover"
//             />
//           ) : (
//             <User className="h-12 w-12 text-muted-foreground/40" />
//           )}
//         </div>

//         {/* Camera button */}
//         <button
//           type="button"
//           onClick={() => fileInputRef.current?.click()}
//           className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-colors"
//           aria-label="Upload photo"
//         >
//           <Camera className="h-4 w-4" />
//         </button>

//         {/* Remove button */}
//         {preview && (
//           <button
//             type="button"
//             onClick={handleRemove}
//             className="absolute top-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 transition-colors"
//             aria-label="Remove photo"
//           >
//             <X className="h-3 w-3" />
//           </button>
//         )}
//       </div>

//       {/* Hidden file input */}
//       <input
//         ref={fileInputRef}
//         type="file"
//         accept="image/jpeg,image/png,image/webp,image/gif"
//         className="hidden"
//         onChange={handleFileChange}
//       />

//       {/* Instructions */}
//       <div className="text-center">
//         <button
//           type="button"
//           onClick={() => fileInputRef.current?.click()}
//           className="text-sm font-medium text-primary hover:underline"
//         >
//           Click to upload
//         </button>
//         <span className="text-sm text-muted-foreground"> or drag & drop</span>
//         <p className="mt-1 text-xs text-muted-foreground">
//           JPG, PNG, WEBP — max 2MB
//         </p>
//       </div>
//     </div>
//   );
// }

// // ─── Main Page ────────────────────────────────────────────────────────────────
// export default function TutorProfilePage() {
//   const router = useRouter();

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [toast, setToast] = useState<Toast>(null);
//   const [categories, setCategories] = useState<Category[]>([]);
//   // ✅ image state আলাদা রাখছি
//   const [imageBase64, setImageBase64] = useState<string | null>(null);
//   const [currentImage, setCurrentImage] = useState<string | null>(null);

//   const [form, setForm] = useState<TutorProfileForm>({
//     id: "",
//     bio: "",
//     hourlyRate: 0,
//     experience: 0,
//     categoryIds: [],
//   });

//   // ── Load categories + existing profile ──
//   useEffect(() => {
//     const load = async () => {
//       try {
//         // categories
//         const catRes = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/categories`
//         );
//         const catJson = await catRes.json();
//         setCategories(catJson.data ?? []);

//         // existing tutor profile (to pre-fill form + show current image)
//         const profileRes = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/tutors/dashboard`,
//           { credentials: "include" }
//         );
//         if (profileRes.ok) {
//           const profileJson = await profileRes.json();
//           const profile = profileJson.data?.tutorProfile;
//           const userImage = profileJson.data?.image ?? null;

//           if (profile) {
//             setForm({
//               id: profile.id ?? "",
//               bio: profile.bio ?? "",
//               hourlyRate: profile.hourlyRate ?? 0,
//               experience: profile.experience ?? 0,
//               categoryIds: profile.categories?.map((c: Category) => c.id) ?? [],
//             });
//           }
//           // current saved image
//           setCurrentImage(userImage);
//         }
//       } catch {
//         showToast("error", "Failed to load profile.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, []);

//   // ── Auto-dismiss toast ──
//   useEffect(() => {
//     if (!toast) return;
//     const t = setTimeout(() => setToast(null), 4000);
//     return () => clearTimeout(t);
//   }, [toast]);

//   function showToast(type: "success" | "error", message: string) {
//     setToast({ type, message });
//   }

//   function handleChange(
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) {
//     const { name, value } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]:
//         name === "hourlyRate" || name === "experience" ? Number(value) : value,
//     }));
//   }

//   function toggleCategory(id: string) {
//     setForm((prev) => ({
//       ...prev,
//       categoryIds: prev.categoryIds.includes(id)
//         ? prev.categoryIds.filter((c) => c !== id)
//         : [...prev.categoryIds, id],
//     }));
//   }

//   async function handleSubmit() {
//     setSaving(true);
//     try {
//       // ✅ image থাকলে সেটাও পাঠাচ্ছি
//       const payload = {
//         ...form,
//         ...(imageBase64 !== null && { image: imageBase64 }),
//       };

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/tutors/profile`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify(payload),
//         }
//       );

//       if (res.ok) {
//         showToast("success", "Profile updated successfully!");
//         router.refresh();
//       } else {
//         showToast("error", "Failed to update profile. Please try again.");
//       }
//     } catch {
//       showToast("error", "Network error. Please check your connection.");
//     } finally {
//       setSaving(false);
//     }
//   }

//   // ── Loading state ──
//   if (loading) {
//     return (
//       <div className="flex min-h-[60vh] items-center justify-center">
//         <div className="flex flex-col items-center gap-3 text-muted-foreground">
//           <Loader2 className="h-8 w-8 animate-spin text-primary" />
//           <p className="text-sm tracking-wide">Loading profile…</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">

//         {/* ── Toast ── */}
//         {toast && (
//           <div
//             className={`mb-6 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
//               toast.type === "success"
//                 ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
//                 : "border-rose-500/30 bg-rose-500/10 text-rose-400"
//             }`}
//           >
//             {toast.type === "success" ? (
//               <CheckCircle2 className="h-4 w-4 shrink-0" />
//             ) : (
//               <AlertCircle className="h-4 w-4 shrink-0" />
//             )}
//             {toast.message}
//           </div>
//         )}

//         {/* ── Header ── */}
//         <div className="mb-8">
//           <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
//             Tutor Settings
//           </p>
//           <h1 className="mt-1.5 text-3xl font-black tracking-tight">
//             Edit Profile
//           </h1>
//           <p className="mt-1 text-sm text-muted-foreground">
//             Keep your profile updated to attract more students.
//           </p>
//         </div>

//         <div className="space-y-5">

//           {/* ── Profile Image ── */}
//           <Section icon={User} title="Profile Photo">
//             <ImageUpload
//               currentImage={currentImage}
//               onImageChange={setImageBase64}
//             />
//           </Section>

//           {/* ── Bio ── */}
//           <Section icon={User} title="About You">
//             <div className="space-y-2">
//               <Label htmlFor="bio" className="text-sm font-medium">
//                 Bio
//               </Label>
//               <Textarea
//                 id="bio"
//                 name="bio"
//                 placeholder="Tell students about your teaching style, background…"
//                 rows={4}
//                 value={form.bio ?? ""}
//                 onChange={handleChange}
//                 className="resize-none"
//               />
//               <p className="text-xs text-muted-foreground">
//                 {(form.bio ?? "").length} / 500 characters recommended
//               </p>
//             </div>
//           </Section>

//           {/* ── Rate & Experience ── */}
//           <Section icon={DollarSign} title="Rate & Experience">
//             <div className="grid gap-4 sm:grid-cols-2">
//               <div className="space-y-2">
//                 <Label htmlFor="hourlyRate" className="text-sm font-medium">
//                   Hourly Rate (USD)
//                 </Label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
//                     $
//                   </span>
//                   <Input
//                     id="hourlyRate"
//                     name="hourlyRate"
//                     type="number"
//                     min={0}
//                     step={0.5}
//                     value={form.hourlyRate}
//                     onChange={handleChange}
//                     className="pl-7"
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="experience" className="text-sm font-medium">
//                   Years of Experience
//                 </Label>
//                 <div className="relative">
//                   <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                   <Input
//                     id="experience"
//                     name="experience"
//                     type="number"
//                     min={0}
//                     max={50}
//                     value={form.experience}
//                     onChange={handleChange}
//                     className="pl-9"
//                   />
//                 </div>
//               </div>
//             </div>

//             {(form.hourlyRate > 0 || form.experience > 0) && (
//               <div className="mt-4 flex flex-wrap gap-2">
//                 {form.hourlyRate > 0 && (
//                   <Badge variant="secondary" className="gap-1.5">
//                     <DollarSign className="h-3 w-3" />${form.hourlyRate}/hr
//                   </Badge>
//                 )}
//                 {form.experience > 0 && (
//                   <Badge variant="secondary" className="gap-1.5">
//                     <Briefcase className="h-3 w-3" />
//                     {form.experience} yr{form.experience !== 1 ? "s" : ""}{" "}
//                     experience
//                   </Badge>
//                 )}
//               </div>
//             )}
//           </Section>

//           {/* ── Categories ── */}
//           <Section icon={BookMarked} title="Teaching Categories">
//             <p className="mb-4 text-xs text-muted-foreground">
//               Select all subjects you teach.
//             </p>

//             {categories.length === 0 ? (
//               <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border py-6 text-sm text-muted-foreground">
//                 <BookMarked className="h-4 w-4 opacity-40" />
//                 No categories available
//               </div>
//             ) : (
//               <div className="flex flex-wrap gap-2">
//                 {categories.map((cat) => {
//                   const selected = form.categoryIds.includes(cat.id);
//                   return (
//                     <button
//                       key={cat.id}
//                       type="button"
//                       onClick={() => toggleCategory(cat.id)}
//                       className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${
//                         selected
//                           ? "border-primary bg-primary text-primary-foreground"
//                           : "border-border bg-muted/30 text-muted-foreground hover:border-primary/50 hover:text-foreground"
//                       }`}
//                     >
//                       {selected && <CheckCircle2 className="h-3.5 w-3.5" />}
//                       {cat.icon && <span>{cat.icon}</span>}
//                       {cat.name}
//                     </button>
//                   );
//                 })}
//               </div>
//             )}

//             {form.categoryIds.length > 0 && (
//               <p className="mt-3 text-xs text-muted-foreground">
//                 {form.categoryIds.length} Category
//                 {form.categoryIds.length !== 1 ? "ies" : "y"} selected
//               </p>
//             )}
//           </Section>

//           {/* ── Save ── */}
//           <div className="flex items-center justify-between pt-2">
//             <p className="text-xs text-muted-foreground">
//               Changes are saved to your public profile immediately.
//             </p>
//             <Button
//               onClick={handleSubmit}
//               disabled={saving}
//               className="min-w-[130px] gap-2"
//             >
//               {saving ? (
//                 <>
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                   Saving…
//                 </>
//               ) : (
//                 <>
//                   <Save className="h-4 w-4" />
//                   Save Profile
//                 </>
//               )}
//             </Button>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }








