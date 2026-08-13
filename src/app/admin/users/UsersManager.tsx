// app/admin/users/UsersManager.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  createdAt: Date | string;   // ✅ accept both Date and string
};

const ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "CATALOG_MANAGER",
  "INVENTORY_MANAGER",
  "ORDER_MANAGER",
  "CUSTOMER_SUPPORT",
  "MARKETING_MANAGER",
  "ACCOUNTS",
  "CUSTOMER",
];

export default function UsersManager({ initialUsers }: { initialUsers: User[] }) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  function openRoleDialog(user: User) {
    setSelectedUser(user);
    setNewRole(user.role);
    setOpen(true);
  }

  async function saveRole() {
    if (!selectedUser || !newRole) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUser.id, role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...u, role: newRole } : u
        )
      );
      toast.add({ title: "Role updated" });
      setOpen(false);
      router.refresh();
    } catch (error: any) {
      toast.add({ title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-outline-variant bg-surface overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-surface-container-low">
          <tr className="border-b border-outline-variant">
            <th className="px-4 py-3 text-sm font-medium">Name</th>
            <th className="px-4 py-3 text-sm font-medium">Email</th>
            <th className="px-4 py-3 text-sm font-medium">Role</th>
            <th className="px-4 py-3 text-sm font-medium">Created</th>
            <th className="px-4 py-3 text-sm font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-surface-container-low">
              <td className="px-4 py-3">{user.name || "—"}</td>
              <td className="px-4 py-3">{user.email || "—"}</td>
              <td className="px-4 py-3">
                <span className="inline-block px-2 py-1 text-xs rounded bg-surface-container-high">
                  {user.role}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-on-surface-variant">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openRoleDialog(user)}
                >
                  Edit Role
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Change Role for {selectedUser?.name || selectedUser?.email}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full rounded border border-outline-variant px-3 py-2"
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <Button onClick={saveRole} disabled={loading} className="w-full">
              {loading ? "Saving..." : "Save Role"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}