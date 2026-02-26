import { apiFetch } from "@/lib/api";
import Link from "next/link";
import {
  Search,
  DollarSign,
  Award,
  Star,
  Clock,
  Filter,
  TrendingUp,
  User,
  ChevronRight
} from "lucide-react";

type Tutor = {
  id: string;
  userId: string;
  hourlyRate: number;
  experience: number;
  bio?: string;
  rating: number;
  totalReviews: number;
  isFeatured: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  categories?: Array<{
    id: string;
    name: string;
    icon?: string;
  }>;
};

export default async function TutorsPage() {
  const res = await apiFetch<{ data: Tutor[] }>("/tutors");
  const tutors = res?.data || [];

  // Separate featured and regular tutors
  const featuredTutors = tutors.filter(t => t.isFeatured);
  const regularTutors = tutors.filter(t => !t.isFeatured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Tutor
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Connect with expert tutors and start learning today
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by subject, tutor name, or expertise..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg"
                />
              </div>
              <p className="text-blue-100 text-sm mt-3">
                {`🔍 Try searching: "Math", "Physics", "English", "Programming"`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="text-3xl font-bold text-blue-600">{tutors.length}</div>
            <div className="text-gray-600 text-sm mt-1">Expert Tutors</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="text-3xl font-bold text-green-600">
              {tutors.reduce((acc, t) => acc + t.totalReviews, 0)}
            </div>
            <div className="text-gray-600 text-sm mt-1">Total Reviews</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="text-3xl font-bold text-purple-600">
              {Math.round(tutors.reduce((acc, t) => acc + t.rating, 0) / tutors.length * 10) / 10 || 0}★
            </div>
            <div className="text-gray-600 text-sm mt-1">Average Rating</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="text-3xl font-bold text-orange-600">
              ${Math.min(...tutors.map(t => t.hourlyRate))}+
            </div>
            <div className="text-gray-600 text-sm mt-1">Starting Price/hr</div>
          </div>
        </div>

        {/* Filters & Sort (Placeholder) */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition border border-gray-200">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700 font-medium">Filters</span>
            </button>
            <select className="bg-white px-4 py-2 rounded-lg shadow-md border border-gray-200 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300">
              <option>All Categories</option>
              <option>Mathematics</option>
              <option>Science</option>
              <option>Languages</option>
              <option>Programming</option>
            </select>
          </div>

          <select className="bg-white px-4 py-2 rounded-lg shadow-md border border-gray-200 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300">
            <option>Sort by: Recommended</option>
            <option>Highest Rated</option>
            <option>Most Reviews</option>
            <option>Lowest Price</option>
            <option>Highest Price</option>
            <option>Most Experience</option>
          </select>
        </div>

        {/* Featured Tutors Section */}
        {featuredTutors.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900">Featured Tutors</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTutors.map((tutor) => (
                <TutorCard key={tutor.userId} tutor={tutor} featured />
              ))}
            </div>
          </div>
        )}

        {/* All Tutors Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {featuredTutors.length > 0 ? 'All Tutors' : 'Browse Tutors'}
          </h2>

          {regularTutors.length === 0 && featuredTutors.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-md">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No tutors found</h3>
              <p className="text-gray-500">Check back later for available tutors</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularTutors.map((tutor) => (
                <TutorCard key={tutor.userId} tutor={tutor} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Tutor Card Component
function TutorCard({ tutor, featured = false }: { tutor: Tutor; featured?: boolean }) {
  return (
    <div className={`bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden ${featured ? 'ring-2 ring-yellow-400' : ''
      }`}>

      {/* Card Header */}
      <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-6 pb-20">
        {featured && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
            <Award className="w-3 h-3" />
            FEATURED
          </div>
        )}

        {/* Profile Image */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          {tutor.user.image ? (
            <img
              src={tutor.user.image}
              alt={tutor.user.name}
              className="w-24 h-24 rounded-full border-4 border-white shadow-xl object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl bg-gray-200 flex items-center justify-center">
              <User className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="pt-16 px-6 pb-6">

        {/* Name & Rating */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {tutor.user.name}
          </h3>

          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-semibold text-gray-700">
                {tutor.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-500 text-sm">
              ({tutor.totalReviews} {tutor.totalReviews === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        </div>

        {/* Categories */}
        {tutor.categories && tutor.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {tutor.categories.slice(0, 3).map((category) => (
              <span
                key={category.id}
                className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
              >
                {category.name}
              </span>
            ))}
            {tutor.categories.length > 3 && (
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                +{tutor.categories.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Bio Preview */}
        {tutor.bio && (
          <p className="text-gray-600 text-sm text-center mb-4 line-clamp-2">
            {tutor.bio}
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-gray-700 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium">Experience</span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {tutor.experience} {tutor.experience === 1 ? 'year' : 'years'}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-gray-700 mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs font-medium">Hourly Rate</span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              ${tutor.hourlyRate}
            </div>
          </div>
        </div>

        {/* View Profile Button */}
        <Link
          href={`/tutors/${tutor.userId}`}
          className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center font-semibold py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg group"
        >
          <span className="flex items-center justify-center gap-2">
            View Profile
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>
      </div>
    </div>
  );
}








































