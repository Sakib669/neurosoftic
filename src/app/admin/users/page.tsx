;
import { getAllUsers } from "@/lib/services/adminService";
import UsersManager from "./UsersManager";

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Management</h1>
      <UsersManager initialUsers={users} />
    </div>
  );
}