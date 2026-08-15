// components/admin/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Globe,
  Settings,
  LogOut,
  Users,
  BarChart3,
  History, // ✅ added missing import
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/cms", label: "CMS Builder", icon: Globe },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/audit-logs", label: "Audit Logs", icon: History }, // ✅ now works
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-primary-container text-white h-screen fixed left-0 top-0 p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <p className="text-sm opacity-70">Enterprise Edition</p>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive
                  ? "bg-secondary-container text-on-secondary-container font-bold"
                  : "hover:bg-on-primary-container/10"
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-2">
        <Link
          href="/"
          className="block text-center bg-on-primary-container text-primary-container py-2 rounded"
        >
          View Storefront
        </Link>
        <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-on-primary-container/10 rounded">
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
}
