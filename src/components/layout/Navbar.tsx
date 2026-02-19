"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "./ModeToggle";

// ================= TYPES =================
type UserRole = "STUDENT" | "TUTOR" | "ADMIN";

interface User {
  id: string;
  name: string;
  role: UserRole;
}

interface MenuItem {
  title: string;
  url: string;
}

interface NavbarProps {
  className?: string;
}

// ================= MENUS =================
const publicMenu: MenuItem[] = [
  { title: "Home", url: "/" },
  { title: "Find Tutor", url: "/tutors" },
  { title: "About", url: "/about" },
];

// const studentMenu: MenuItem[] = [
//   { title: "Dashboard", url: "/dashboard" },
//   { title: "My Bookings", url: "/dashboard/bookings" },
//   { title: "Profile", url: "/dashboard/profile" },
// ];



// Navbar এ studentMenu
const studentMenu: MenuItem[] = [
  { title: "Dashboard", url: "/student/dashboard" },   // ← বদলাও
  { title: "My Bookings", url: "/student/bookings" },  // ← বদলাও
  { title: "Profile", url: "/student/profile" },       // ← বদলাও
];

const tutorMenu: MenuItem[] = [
  { title: "Tutor Dashboard", url: "/tutor/dashboard" },
  { title: "Profile", url: "/tutor/profile" },
  { title: "Availability", url: "/tutor/availability" },
];

const adminMenu: MenuItem[] = [
  { title: "Admin Dashboard", url: "/admin" },
  { title: "Users", url: "/admin/users" },
  { title: "Bookings", url: "/admin/bookings" },
];

// ================= COMPONENT =================
const Navbar = ({ className }: NavbarProps) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // 🔐 Fetch logged-in user
  // useEffect(() => {
  //   const fetchMe = async () => {
  //     try {
  //       const res = await fetch("/api/auth/me", {
  //         credentials: "include",
  //       });

  //       if (!res.ok) {
  //         setUser(null);
  //         return;
  //       }

  //       const json = await res.json();
  //       setUser(json.data);
  //     } catch {
  //       setUser(null);
  //     }
  //   };

  //   fetchMe();
  // }, []);

  // Tested::

  useEffect(() => {
  const fetchMe = async () => {
    try {
      const res = await fetch(
        "/api/auth/me",
        {
          credentials: "include",
        }
      );
       console.log("✅ API Status:", res.status); 

      if (!res.ok) {
        setUser(null);
        return;
      }

      const json = await res.json();
      setUser(json.data);
    } catch (err) {
       console.log("🔴 Fetch Error:", err);
      setUser(null);
    }
  };

  fetchMe();
}, []);


  // 🚪 Logout (better-auth)
  const handleLogout = async () => {
    // await fetch("/api/auth/sign-out", {
    //   method: "POST",
    //   credentials: "include",
    // });
    await fetch("/api/auth/sign-out", {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    router.push("/login");
  };

  // 🧠 Resolve role-based menu
  const roleMenu: MenuItem[] = (() => {
    if (!user) return [];
    if (user.role === "TUTOR") return tutorMenu;
    if (user.role === "ADMIN") return adminMenu;
    return studentMenu;
  })();

  return (
    <section className={cn("py-4 border-b", className)}>
      <div className="container mx-auto px-4">
        {/* ================= DESKTOP ================= */}
        <nav className="hidden lg:flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="https://i.ibb.co/GfSxzpnb/skillbridge.png"
              className="max-h-8 dark:invert"
              alt="SkillBridge"
            />
            <span className="text-lg font-semibold">SkillBridge</span>
          </Link>

          {/* Menu */}
          <NavigationMenu>
            <NavigationMenuList>
              {publicMenu.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.url}
                      className="px-4 py-2 text-sm font-medium hover:text-primary"
                    >
                      {item.title}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}

              {roleMenu.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.url}
                      className="px-4 py-2 text-sm font-medium hover:text-primary"
                    >
                      {item.title}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ModeToggle />

            {!user ? (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/register">Register</Link>
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="destructive"
                onClick={handleLogout}
              >
                Logout
              </Button>
            )}
          </div>
        </nav>

        {/* ================= MOBILE ================= */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="https://i.ibb.co/GfSxzpnb/skillbridge.png"
                className="max-h-8 dark:invert"
                alt="SkillBridge"
              />
            </Link>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>

              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-4 mt-6">
                  {[...publicMenu, ...roleMenu].map((item) => (
                    <Link
                      key={item.title}
                      href={item.url}
                      className="text-md font-semibold"
                    >
                      {item.title}
                    </Link>
                  ))}

                  <ModeToggle />

                  {!user ? (
                    <>
                      <Button asChild variant="outline">
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button asChild>
                        <Link href="/register">Register</Link>
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="destructive"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Navbar };































