"use client";

// এই page টা /admin/getAlUsers এ integrated করা আছে।
// তবে standalone ও রাখলাম যদি দরকার হয়।

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { AdminUser, ApiResponse } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function UpdateStatusPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "BANNED" | "ACTIVE">("ALL");

  const fetchUsers = async () => {
    try {
      const res = await apiFetch<ApiResponse<AdminUser[]>>("/admin/users");
      setUsers(res.data);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggle = async (user: AdminUser, field: "isBanned" | "isActive") => {
    try {
      await apiFetch(`/admin/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify({ [field]: !user[field] }),
      });
      toast.success("Status updated!");
      fetchUsers();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const filtered = users.filter((u) => {
    if (filter === "BANNED") return u.isBanned;
    if (filter === "ACTIVE") return !u.isBanned && u.isActive;
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Update User Status</h1>
        <p className="text-muted-foreground text-sm mt-1">Ban or unban users</p>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2">
        {(["ALL", "ACTIVE", "BANNED"] as const).map((f) => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? "default" : "outline"}
            onClick={() => setFilter(f)}
          >
            {f}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Users ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium">User</th>
                  <th className="text-left px-4 py-3 font-medium">Role</th>
                  <th className="text-left px-4 py-3 font-medium">Banned</th>
                  <th className="text-left px-4 py-3 font-medium">Active</th>
                  <th className="text-left px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium">{user.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      {user.isBanned ? (
                        <Badge variant="destructive">Yes</Badge>
                      ) : (
                        <Badge variant="outline">No</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {user.isActive ? (
                        <Badge variant="outline" className="text-green-600 border-green-300">Yes</Badge>
                      ) : (
                        <Badge variant="secondary">No</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {user.role !== "ADMIN" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={user.isBanned ? "outline" : "destructive"}
                            onClick={() => handleToggle(user, "isBanned")}
                          >
                            {user.isBanned ? "Unban" : "Ban"}
                          </Button>
                          <Button
                            size="sm"
                            variant={user.isActive ? "secondary" : "outline"}
                            onClick={() => handleToggle(user, "isActive")}
                          >
                            {user.isActive ? "Deactivate" : "Activate"}
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}