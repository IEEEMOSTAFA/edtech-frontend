
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ MUST await cookies()
  const cookieStore = await cookies();

  // ✅ build valid Cookie header
  const cookieHeader = cookieStore
    .getAll()
    .map((c: { name: string; value: string }) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(`${process.env.API_URL}/api/auth/me`, {
    headers: {
      Cookie: cookieHeader,
    },
    cache: "no-store",
  });

  if (!res.ok) redirect("/login");

  const { data } = await res.json();

  if (data.role !== "STUDENT") redirect("/unauthorized");
  
  return <>{children}</>;
}