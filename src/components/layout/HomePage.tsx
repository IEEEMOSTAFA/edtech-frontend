"use client";

import React from "react";
import Link from "next/link";
import { 
  Book, 
  GraduationCap, 
  Users, 
  Star, 
  Clock, 
  TrendingUp, 
  Search,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Globe,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const featuredTutors = [
    {
      id: 1,
      name: "Dr. Sarah Chen",
      subject: "Mathematics",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      rating: 4.9,
      students: 234,
      price: "$45/hr",
      expertise: "Calculus, Linear Algebra",
    },
    {
      id: 2,
      name: "James Wilson",
      subject: "Physics",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
      rating: 4.8,
      students: 189,
      price: "$40/hr",
      expertise: "Quantum Mechanics",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      subject: "Computer Science",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      rating: 5.0,
      students: 312,
      price: "$55/hr",
      expertise: "Web Development, AI",
    },
    {
      id: 4,
      name: "Michael Park",
      subject: "Chemistry",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      rating: 4.7,
      students: 156,
      price: "$42/hr",
      expertise: "Organic Chemistry",
    },
  ];

  const categories = [
    { name: "Mathematics", icon: "📐", count: 45 },
    { name: "Science", icon: "🔬", count: 38 },
    { name: "Programming", icon: "💻", count: 52 },
    { name: "Languages", icon: "🗣️", count: 31 },
    { name: "Music", icon: "🎵", count: 24 },
    { name: "Art & Design", icon: "🎨", count: 29 },
  ];

  const stats = [
    { label: "Expert Tutors", value: "500+", icon: Users },
    { label: "Students Taught", value: "10,000+", icon: GraduationCap },
    { label: "Success Rate", value: "98%", icon: TrendingUp },
    { label: "Countries", value: "50+", icon: Globe },
  ];

  const features = [
    {
      title: "Verified Expert Tutors",
      description: "All tutors are thoroughly vetted and verified professionals",
      icon: Award,
    },
    {
      title: "Flexible Scheduling",
      description: "Book sessions that fit your schedule, anytime, anywhere",
      icon: Clock,
    },
    {
      title: "Personalized Learning",
      description: "One-on-one sessions tailored to your learning style",
      icon: Sparkles,
    },
    {
      title: "Money-Back Guarantee",
      description: "Not satisfied? Get a full refund within 24 hours",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section with Gradient Background */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Join 10,000+ successful students
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
                Learn From The{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-accent">
                  Best Tutors
                </span>{" "}
                Worldwide
              </h1>

              <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
                Connect with verified expert tutors for personalized one-on-one
                sessions. Master any subject at your own pace.
              </p>

              {/* Search Bar */}
              <div className="flex gap-3 p-2 bg-background rounded-xl border-2 border-border shadow-lg max-w-2xl">
                <div className="flex-1 flex items-center gap-3 px-4">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search for tutors, subjects, or skills..."
                    className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <Button size="lg" className="px-8">
                  Search
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="px-8 text-base">
                  <Link href="/tutors">
                    Browse Tutors
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="px-8 text-base">
                  <Link href="/register?role=tutor">
                    Become a Tutor
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`}
                      alt="Student"
                      className="w-10 h-10 rounded-full border-2 border-background"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    4.9/5 from 2,500+ reviews
                  </p>
                </div>
              </div>
            </div>

            {/* Right Content - Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <Icon className="h-8 w-8 text-primary mb-4" />
                    <div className="text-4xl font-black mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                );
              })}
            </div>
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

      {/* Featured Tutors Section */}
      <section className="py-20">
        <div className="mx-auto w-full max-w-7xl px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Featured Tutors
              </h2>
              <p className="text-lg text-muted-foreground">
                Top-rated tutors ready to help you succeed
              </p>
            </div>
            <Button asChild variant="outline" size="lg">
              <Link href="/tutors">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTutors.map((tutor, index) => (
              <Link
                key={tutor.id}
                href={`/tutors/${tutor.id}`}
                className="group rounded-2xl bg-card border border-border hover:border-primary/50 overflow-hidden hover:shadow-xl transition-all duration-300"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                  <img
                    src={tutor.image}
                    alt={tutor.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-background/90 backdrop-blur-sm border border-border flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">{tutor.rating}</span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                    {tutor.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {tutor.subject}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    {tutor.expertise}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{tutor.students} students</span>
                    </div>
                    <div className="font-bold text-primary">{tutor.price}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto w-full max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose SkillBridge?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We make learning accessible, effective, and enjoyable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="text-center p-8 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10"></div>
        
        <div className="relative mx-auto w-full max-w-5xl px-4 text-center">
          <Book className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of students who are already mastering new skills with
            expert guidance
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="px-10 text-lg h-14">
              <Link href="/register">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-10 text-lg h-14">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-8">
            No credit card required • Free trial available
          </p>
        </div>
      </section>
    </div>
  );
}









// ---------------------------------

