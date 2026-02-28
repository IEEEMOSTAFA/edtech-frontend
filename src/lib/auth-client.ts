// // import { createAuthClient } from "better-auth/react"
// // export const authClient = createAuthClient({
// //     /** The base URL of the server (optional if you're using the same domain) */
// //     // baseURL: "http://localhost:5000"
// //     // only for test it: 
// //     baseURL: "https://edtech-backend-a19l.onrender.com"
// // })







// // test:


// // src/lib/auth-client.ts
// import { createAuthClient } from "better-auth/react";

// export const authClient = createAuthClient({
//   // ✅ dynamic baseURL — যেকোনো port এ কাজ করবে
//   baseURL: typeof window !== "undefined"
//     ? window.location.origin
//     : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
//   fetchOptions: {
//     credentials: "include",
//   },
// });

// export type User = {
//   id: string;
//   name: string;
//   email: string;
//   emailVerified: boolean;
//   image?: string | null;
//   role: "STUDENT" | "TUTOR" | "ADMIN";
//   isActive: boolean;
//   isBanned: boolean;
//   createdAt: string;
//   updatedAt: string;
// };



















// Tested file:::


import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  fetchOptions: {
    credentials: "include",
  },
});

export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role: "STUDENT" | "TUTOR" | "ADMIN";
  isActive: boolean;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
};