// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { UserCircle, GraduationCap, ArrowRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card";

// export default function SelectRolePage() {
//     const router = useRouter();
//     const [selectedRole, setSelectedRole] = useState<"STUDENT" | "TUTOR" | null>(null);
//     const [loading, setLoading] = useState(false);

//     const handleRoleSubmit = async () => {
//         if (!selectedRole) {
//             toast.error("Please select a role");
//             return;
//         }

//         setLoading(true);
//         try {
//             // 🔴 IMPORTANT: Call backend API to update role
//             const response = await fetch("http://localhost:5000/api/auth/update-role", {
//                 method: "PATCH",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 credentials: "include", // ✅ Important for cookies
//                 body: JSON.stringify({ role: selectedRole }),
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.message || "Failed to update role");
//             }

//             toast.success("Role updated successfully!");

//             // Redirect based on role
//             if (selectedRole === "TUTOR") {
//                 router.push("/tutor/profile/setup");
//             } else {
//                 router.push("/dashboard");
//             }
//         }
//         //  catch (error: unknown) {
//         //   toast.error(error.message || "Something went wrong");
//         // }


//         catch (error: unknown) {
//             if (error instanceof Error) {
//                 toast.error(error.message);
//             } else {
//                 toast.error("Something went wrong");
//             }
//         }

//         finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//             <Card className="w-full max-w-2xl shadow-2xl">
//                 <CardHeader className="text-center">
//                     <CardTitle className="text-3xl font-bold">Welcome to SkillBridge! 🎓</CardTitle>
//                     <CardDescription className="text-lg mt-2">
//                         How would you like to use SkillBridge?
//                     </CardDescription>
//                 </CardHeader>

//                 <CardContent className="space-y-6">
//                     <div className="grid md:grid-cols-2 gap-4">

//                         {/* Student Card */}
//                         <label
//                             className={`
//                 relative flex flex-col items-center gap-4 p-6 border-2 rounded-xl cursor-pointer transition-all
//                 ${selectedRole === "STUDENT"
//                                     ? "border-blue-600 bg-blue-50 shadow-lg scale-105"
//                                     : "border-gray-200 hover:border-blue-300 hover:shadow-md"
//                                 }
//               `}
//                         >
//                             <input
//                                 type="radio"
//                                 name="role"
//                                 value="STUDENT"
//                                 checked={selectedRole === "STUDENT"}
//                                 onChange={() => setSelectedRole("STUDENT")}
//                                 className="sr-only"
//                             />

//                             <div className={`p-4 rounded-full ${selectedRole === "STUDENT" ? "bg-blue-600" : "bg-gray-200"
//                                 }`}>
//                                 <UserCircle className={`w-12 h-12 ${selectedRole === "STUDENT" ? "text-white" : "text-gray-500"
//                                     }`} />
//                             </div>

//                             <div className="text-center">
//                                 <h3 className="text-xl font-bold text-gray-900 mb-2">Student</h3>
//                                 <p className="text-sm text-gray-600">
//                                     I want to learn from expert tutors
//                                 </p>
//                             </div>

//                             <ul className="text-sm text-gray-600 space-y-1 text-left w-full">
//                                 <li>✓ Browse tutors</li>
//                                 <li>✓ Book sessions</li>
//                                 <li>✓ Leave reviews</li>
//                             </ul>

//                             {selectedRole === "STUDENT" && (
//                                 <div className="absolute top-3 right-3 bg-blue-600 text-white rounded-full p-1">
//                                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                                         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                                     </svg>
//                                 </div>
//                             )}
//                         </label>

//                         {/* Tutor Card */}
//                         <label
//                             className={`
//                 relative flex flex-col items-center gap-4 p-6 border-2 rounded-xl cursor-pointer transition-all
//                 ${selectedRole === "TUTOR"
//                                     ? "border-indigo-600 bg-indigo-50 shadow-lg scale-105"
//                                     : "border-gray-200 hover:border-indigo-300 hover:shadow-md"
//                                 }
//               `}
//                         >
//                             <input
//                                 type="radio"
//                                 name="role"
//                                 value="TUTOR"
//                                 checked={selectedRole === "TUTOR"}
//                                 onChange={() => setSelectedRole("TUTOR")}
//                                 className="sr-only"
//                             />

//                             <div className={`p-4 rounded-full ${selectedRole === "TUTOR" ? "bg-indigo-600" : "bg-gray-200"
//                                 }`}>
//                                 <GraduationCap className={`w-12 h-12 ${selectedRole === "TUTOR" ? "text-white" : "text-gray-500"
//                                     }`} />
//                             </div>

//                             <div className="text-center">
//                                 <h3 className="text-xl font-bold text-gray-900 mb-2">Tutor</h3>
//                                 <p className="text-sm text-gray-600">
//                                     I want to teach and share my knowledge
//                                 </p>
//                             </div>

//                             <ul className="text-sm text-gray-600 space-y-1 text-left w-full">
//                                 <li>✓ Create profile</li>
//                                 <li>✓ Set availability</li>
//                                 <li>✓ Earn money</li>
//                             </ul>

//                             {selectedRole === "TUTOR" && (
//                                 <div className="absolute top-3 right-3 bg-indigo-600 text-white rounded-full p-1">
//                                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                                         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                                     </svg>
//                                 </div>
//                             )}
//                         </label>
//                     </div>

//                     <Button
//                         onClick={handleRoleSubmit}
//                         disabled={!selectedRole || loading}
//                         className="w-full py-6 text-lg"
//                         size="lg"
//                     >
//                         {loading ? (
//                             "Updating..."
//                         ) : (
//                             <>
//                                 Continue as {selectedRole || "..."}
//                                 <ArrowRight className="ml-2 w-5 h-5" />
//                             </>
//                         )}
//                     </Button>

//                     <p className="text-xs text-gray-500 text-center">
//                         You can always change your role later from settings
//                     </p>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// }