"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Category, TutorProfileForm } from "@/types/tutor";



export default function TutorProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<TutorProfileForm>({
    bio: "",
    hourlyRate: 0,
    experience: 0,
    categoryIds: [],
  });

  // 🔄 Load categories
//   useEffect(() => {
//     const loadCategories = async () => {
//       const res = await fetch(
//         `${process.env.API_URL}/api/categories`
//       );
//       const json = await res.json();
//       setCategories(json.data);
//     };

//     loadCategories();
//     setLoading(false);
//   }, []);


useEffect(() => {
  const loadCategories = async () => {
    try {
      const res = await fetch(
        `${process.env.API_URL}/api/categories`
      );
      const json = await res.json();
      setCategories(json.data);
    } finally {
      setLoading(false); 
    }
  };

  loadCategories();
}, []);


  // 📝 Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "hourlyRate" || name === "experience"
          ? Number(value)
          : value,
    }));
  };

  // 🏷️ Category toggle
  const toggleCategory = (id: string) => {
    setForm((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(id)
        ? prev.categoryIds.filter((c) => c !== id)
        : [...prev.categoryIds, id],
    }));
  };

  // 💾 Submit
  const handleSubmit = async () => {
    setSaving(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tutors/profile`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      }
    );

    setSaving(false);

    if (res.ok) {
      alert("Profile updated successfully ✅");
      router.refresh();
    } else {
      alert("Failed to update profile ❌");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Tutor Profile</h1>

      <textarea
        name="bio"
        placeholder="Short bio"
        className="w-full border p-2"
        value={form.bio}
        onChange={handleChange}
      />

      <input
        type="number"
        name="hourlyRate"
        placeholder="Hourly Rate"
        className="w-full border p-2"
        value={form.hourlyRate}
        onChange={handleChange}
      />

      <input
        type="number"
        name="experience"
        placeholder="Experience (years)"
        className="w-full border p-2"
        value={form.experience}
        onChange={handleChange}
      />

      <div>
        <p className="font-semibold mb-2">Categories</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggleCategory(cat.id)}
              className={`px-3 py-1 border rounded ${
                form.categoryIds.includes(cat.id)
                  ? "bg-black text-white"
                  : ""
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={saving}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {saving ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
}
