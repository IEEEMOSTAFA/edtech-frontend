// types/auth.d.ts

import type { Session, User } from "better-auth/types";

declare module "better-auth/types" {
  interface User {
    role: string; // or "STUDENT" | "TUTOR" | "ADMIN" for strict typing
    isBanned: boolean;
  }

  interface Session {
    user: User & {
      role: string; // or "STUDENT" | "TUTOR" | "ADMIN"
      isBanned: boolean;
    };
  }
}