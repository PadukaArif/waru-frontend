"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getJwtPayload, getUserRole } from "@/services/auth";

const PUBLIC_PATHS = ["/login", "/register"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // 1. Check if current route is a public exception
    const isPublicRoute = PUBLIC_PATHS.some(
      (publicPath) => pathname === publicPath || pathname.startsWith(`${publicPath}/`)
    );

    const payload = getJwtPayload();

    if (isPublicRoute) {
      if (payload) {
        router.replace("/menu");
        return;
      }
      setAuthorized(true);
      setChecking(false);
      return;
    }

    // 2. Protected routes require a valid non-expired JWT payload
    if (!payload) {
      setAuthorized(false);
      setChecking(false);
      router.replace("/login");
      return;
    }

    // 3. Admin routes require "boss" role
    if (pathname === "/admin" || pathname.startsWith("/admin/")) {
      const role = getUserRole();
      if (role !== "boss") {
        setAuthorized(false);
        setChecking(false);
        router.replace("/menu");
        return;
      }
    }

    setAuthorized(true);
    setChecking(false);
  }, [pathname, router]);

  // Display loading screen during auth check on protected routes
  if (checking) {
    const isPublic = PUBLIC_PATHS.some(
      (publicPath) => pathname === publicPath || pathname.startsWith(`${publicPath}/`)
    );
    if (isPublic) {
      return <>{children}</>;
    }

    return (
      <div className="flex flex-1 min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-3">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#4265D6] border-t-transparent"></div>
          <p className="text-xs sm:text-sm font-semibold text-[#293855]">
            Memverifikasi akses WARU...
          </p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}
