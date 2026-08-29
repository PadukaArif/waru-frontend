"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { logout, getUserRole } from "@/services/auth";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const currentLoggedIn = !!token;
    const currentRole = getUserRole();

    setIsLoggedIn((prev) => (prev !== currentLoggedIn ? currentLoggedIn : prev));
    setUserRole((prev) => (prev !== currentRole ? currentRole : prev));
  }, [pathname]);

  function handleLogout() {
    logout();
    setIsLoggedIn(false);
    setUserRole(null);
    router.replace("/login");
  }

  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          WARU
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:opacity-70">
            Home
          </Link>

          <Link href="/menu" className="text-sm font-medium hover:opacity-70">
            Menu
          </Link>

          {isLoggedIn ? (
            <>
              <Link href="/order" className="text-sm font-medium hover:opacity-70">
                Orders
              </Link>

              <Link href="/payment" className="text-sm font-medium hover:opacity-70">
                Riwayat Pembayaran
              </Link>

              {userRole === "boss" && (
                <>
                  <Link href="/admin" className="text-sm font-medium hover:opacity-70">
                    Admin
                  </Link>
                  <Link href="/admin/assistant" className="text-sm font-medium hover:opacity-70">
                    AI Assistant
                  </Link>
                </>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-red-50 border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium hover:opacity-70">
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}