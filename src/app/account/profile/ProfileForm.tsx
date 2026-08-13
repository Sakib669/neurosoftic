// app/account/profile/ProfileForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ProfileUser = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
};

export default function ProfileForm({ user }: { user: ProfileUser }) {
  const router = useRouter();
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      });
      if (!res.ok) throw new Error("Update failed");
      toast.add({ title: "Profile updated" });
      router.refresh();
    } catch (error: any) {
      toast.add({ title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) throw new Error("Password change failed");
      toast.add({ title: "Password changed" });
      setCurrentPassword("");
      setNewPassword("");
    } catch (error: any) {
      toast.add({ title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleProfileUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <Button type="submit" disabled={loading}>
          Save Profile
        </Button>
      </form>

      <form
        onSubmit={handlePasswordChange}
        className="space-y-4 border-t border-outline-variant pt-6"
      >
        <h2 className="text-lg font-semibold">Change Password</h2>
        <div>
          <label className="block text-sm font-medium mb-1">
            Current Password
          </label>
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">New Password</label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>
        <Button type="submit" disabled={loading}>
          Change Password
        </Button>
      </form>
    </div>
  );
}
