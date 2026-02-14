"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SearchSection() {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { name: "Mathematics", icon: "📐", count: 45 },
    { name: "Science", icon: "🔬", count: 38 },
    { name: "Programming", icon: "💻", count: 52 },
    { name: "Languages", icon: "🗣️", count: 31 },
    { name: "Music", icon: "🎵", count: 24 },
    { name: "Art & Design", icon: "🎨", count: 29 },
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to search results or trigger search
      window.location.href = `/tutors?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      {/* Search Bar Section */}
      <section className="py-12 bg-background border-b">
        <div className="mx-auto w-full max-w-4xl px-4">
          <div className="flex gap-3 p-2 bg-background rounded-xl border-2 border-border shadow-lg">
            <div className="flex-1 flex items-center gap-3 px-4">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for tutors, subjects, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Button size="lg" className="px-8" onClick={handleSearch}>
              Search
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto w-full max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Explore Popular Categories
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find expert tutors in hundreds of subjects
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                href={`/tutors?category=${category.name}`}
                className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 text-center"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="font-semibold mb-1">{category.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {category.count} tutors
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}