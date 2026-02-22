export interface RouteItem {
   title: string;
   url: string;
}

export const studentRoutes: RouteItem[] = [
   { title: "Dashboard", url: "/student/dashboard" },   // ← বদলাও
   { title: "My Bookings", url: "/student/bookings" },  // ← বদলাও
   { title: "Profile", url: "/student/profile" },       // ← বদলাও
];




// // Navbar এ studentMenu
// const studentMenu: MenuItem[] = [
//    { title: "Dashboard", url: "/student/dashboard" },   // ← বদলাও
//    { title: "My Bookings", url: "/student/bookings" },  // ← বদলাও
//    { title: "Profile", url: "/student/profile" },       // ← বদলাও
// ];