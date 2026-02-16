// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { authClient } from "@/lib/auth-client";
// import { toast } from "sonner";

// // ✅ Define User type
// type UserRole = "STUDENT" | "TUTOR" | "ADMIN";

// interface ExtendedUser {
//   id: string;
//   createdAt: Date;
//   updatedAt: Date;
//   email: string;
//   emailVerified: boolean;
//   name: string;
//   image?: string | null;
//   role: UserRole; // ✅ Now typed
//   isBanned: boolean;
// }

// export default function AuthCallbackPage() {
//   const router = useRouter();

//   useEffect(() => {
//     const checkUserAndRedirect = async () => {
//       try {
//         // Wait a bit for session to be set
//         await new Promise((resolve) => setTimeout(resolve, 1000));

//         // Get current user
//         const { data: session, error } = await authClient.getSession();

//         if (error || !session) {
//           toast.error("Authentication failed");
//           router.push("/login");
//           return;
//         }

//         const user = session.user as ExtendedUser; // ✅ Type assertion
//         console.log("User data:", user);

//         // Check if user is new (created within last 2 minutes)
//         const userCreatedAt = new Date(user.createdAt);
//         const now = new Date();
//         const timeDiff = now.getTime() - userCreatedAt.getTime();
//         const isNewUser = timeDiff < 2 * 60 * 1000; // 2 minutes

//         console.log("Is new user:", isNewUser);
//         console.log("User role:", user.role);

//         // If new Google user, show role selection
//         if (isNewUser && user.role === "STUDENT") {
//           router.push("/select-role");
//           return;
//         }

//         // Redirect based on role
//         if (user.role === "TUTOR") {
//           router.push("/tutor/dashboard");
//         } else if (user.role === "ADMIN") {
//           router.push("/admin");
//         } else {
//           router.push("/dashboard");
//         }
//       } catch (error) {
//         console.error("Callback error:", error);
//         toast.error("Something went wrong");
//         router.push("/login");
//       }
//     };

//     checkUserAndRedirect();
//   }, [router]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
//       <div className="text-center">
//         <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
//         <h2 className="text-xl font-semibold text-gray-900 mb-2">
//           Setting up your account...
//         </h2>
//         <p className="text-gray-600">Please wait a moment</p>
//       </div>
//     </div>
//   );
// }