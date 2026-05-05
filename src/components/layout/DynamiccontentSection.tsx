// SERVER COMPONENT — no "use client"
import Link from "next/link";
import {
  Book, Users, Star, Clock, ArrowRight,
  CheckCircle, Sparkles, Award, User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";
import TutorCardClient from "./Tutorcardclient";
import FeaturesSection from "./Featuressection";
import CTASection from "./Ctasection";

type FeaturedTutor = {
  id: string;
  userId: string;
  hourlyRate: number;
  experience: number;
  bio?: string;
  rating: number;
  totalReviews: number;
  isFeatured: boolean;
  user: { id: string; name: string; image?: string };
  categories?: Array<{ id: string; name: string; icon?: string }>;
};

// ✅ async Server Component
export default async function DynamicContentSection() {
  let allTutors: FeaturedTutor[] = [];

  try {
    const res = await apiFetch<{ data: FeaturedTutor[] }>("/tutors");
    allTutors = res?.data ?? [];
  } catch (error) {
    console.error("⚠️ Could not fetch tutors:", error);
  }

  const featured = allTutors.filter((t) => t.isFeatured);
  const rest = allTutors.filter((t) => !t.isFeatured);
  const displayTutors = [...featured, ...rest].slice(0, 4);

  return (
    <>
      {/* Featured Tutors — client island for animations */}
      <TutorCardClient tutors={displayTutors} />

      {/* Features — no props passed; FEATURES array lives inside the Client Component */}
      <FeaturesSection />

      {/* CTA */}
      <CTASection />
    </>
  );
}