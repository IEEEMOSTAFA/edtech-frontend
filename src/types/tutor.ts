// src/types/tutor.ts

export type TutorDashboard = {
  id: string;
  bookingsAsTutor: {
    id: string;
    sessionDate: string;
    student: {
      id: string;
      name: string;
    };
    review?: {
      rating: number;
      comment: string;
    } | null;
  }[];
};



// src/types/tutor.ts

export type Tutor = {
  id: string;
  bio: string;
  user: {
    name: string;
  };
};

export type AvailabilitySlot = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};


export type ApiResponse<T> = {
  data: T;
};


export type Category = {
  id: string;
  name: string;
};
export type TutorProfileForm = {
  id: string,
  bio?: string;
  hourlyRate: number;
  experience: number;
  categoryIds: string[];
};
