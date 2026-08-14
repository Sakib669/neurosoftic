// proxy.ts
import { auth as proxy } from "./auth";
import { NextResponse } from "next/server";

const ADMIN_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "CATALOG_MANAGER",
  "INVENTORY_MANAGER",
  "ORDER_MANAGER",
  "CUSTOMER_SUPPORT",
  "MARKETING_MANAGER",
  "ACCOUNTS",
];

export default auth((req) => {
  const path = req.nextUrl.pathname;

  if (path.startsWith("/admin")) {
    const role = req.auth?.user?.role;
    if (!role || !ADMIN_ROLES.includes(role)) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (path.startsWith("/account") && !req.auth) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};