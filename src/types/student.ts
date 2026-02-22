// src/types/student.ts

// ================= DASHBOARD =================
export type StudentDashboard = {
  totalBookings: number;
  completedBookings: number;
};

// ================= BOOKING =================
export type BookingStatus = "CONFIRMED" | "COMPLETED" | "CANCELLED";

export type MyBooking = {
   id: string;
  tutorId: string;
  sessionDate: string;
  duration: number;
  status: BookingStatus;
  notes?: string | null;
  price: number;
  createdAt: string;
  tutor: {
    id: string
    name: string;
    email: string;
  };
  review?: {
  id: string;
  rating: number;
  comment?: string;
} | null;
};

// ================= PROFILE =================
export type StudentProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
  createdAt: string;
  updatedAt?: string;
};

export type UpdateProfilePayload = {
  name?: string;
  image?: string;
};

// ================= REVIEW =================
export type CreateReviewPayload = {
  bookingId: string;
  tutorId: string;
  rating: number;
  comment?: string;
};

// ================= API WRAPPER =================
export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};