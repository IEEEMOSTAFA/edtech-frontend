

// ─── Shared primitives ────────────────────────────────────────────────────────

export type BookingStatus = "CONFIRMED" | "COMPLETED" | "CANCELLED";

export type ApiResponse<T> = {
  success: boolean;
  data: T;
};

// ─── Category ─────────────────────────────────────────────────────────────────

export type Category = {
  id: string;
  name: string;
};

// ─── Availability ─────────────────────────────────────────────────────────────

export type AvailabilitySlot = {
  id: string;
  dayOfWeek: number; // 0 = Sunday … 6 = Saturday
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  isAvailable?: boolean;
};

// ─── Tutor (public browse list / profile page) ────────────────────────────────

export type Tutor = {
  id: string;
  bio: string;
  hourlyRate: number;
  experience: number;
  user: {
    id: string;
    name: string;
    email: string;
  };
  categories: Category[];
};

// ─── Tutor profile form ───────────────────────────────────────────────────────

export type TutorProfileForm = {
  id: string;
  bio?: string;
  hourlyRate: number;
  experience: number;
  categoryIds: string[];
};

// ─── Dashboard types ──────────────────────────────────────────────────────────

export type DashboardStudent = {
  id: string;
  name: string;
  email: string;
};

export type DashboardReview = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  student: DashboardStudent;
};

export type DashboardBooking = {
  id: string;
  sessionDate: string;
  status: BookingStatus;
  totalPrice: number | null;
  student: DashboardStudent;
  review: DashboardReview | null;
};

export type DashboardTutorProfile = {
  id: string;
  bio: string | null;
  hourlyRate: number;
  experience: number;
  categories: Category[];
  reviews: DashboardReview[];
};

export type TutorDashboard = {
  id: string;
  name: string;
  email: string;
  bookingsAsTutor: DashboardBooking[];
  tutorProfile: DashboardTutorProfile | null;
};