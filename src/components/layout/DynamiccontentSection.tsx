"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Book,
  Users,
  Star,
  Clock,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DynamicContentSection() {
  // State for dynamic data - can be fetched from API
  const [featuredTutors, setFeaturedTutors] = useState([
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
  ]);

  const [loading, setLoading] = useState(false);

  // Example: Fetch tutors from API
  useEffect(() => {
    // Uncomment to fetch from real API
    // fetchFeaturedTutors();
  }, []);

  const fetchFeaturedTutors = async () => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      // const response = await fetch('/api/tutors/featured');
      // const data = await response.json();
      // setFeaturedTutors(data);
    } catch (error) {
      console.error("Error fetching tutors:", error);
    } finally {
      setLoading(false);
    }
  };

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
    <>
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

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
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
                      <span className="text-sm font-semibold">
                        {tutor.rating}
                      </span>
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
          )}
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
            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-10 text-lg h-14"
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-8">
            No credit card required • Free trial available
          </p>
        </div>
      </section>
    </>
  );
}