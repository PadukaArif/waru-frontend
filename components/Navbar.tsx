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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const currentLoggedIn = !!token;
    const currentRole = getUserRole();

    setIsLoggedIn((prev) => (prev !== currentLoggedIn ? currentLoggedIn : prev));
    setUserRole((prev) => (prev !== currentRole ? currentRole : prev));
    setMobileMenuOpen(false);
  }, [pathname]);

  function handleLogout() {
    logout();
    setIsLoggedIn(false);
    setUserRole(null);
    setMobileMenuOpen(false);
    router.replace("/login");
  }

  function isActive(path: string) {
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  }

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 py-3 sm:py-3.5">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-lg px-2 py-1 hover:opacity-80 transition">
          WARU
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1.5">
          <Link
            href="/"
            className={`text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-lg px-3 py-1.5 ${
              isActive("/") ? "text-black bg-gray-100 font-semibold" : "text-gray-600 hover:text-black hover:bg-gray-50"
            }`}
          >
            Home
          </Link>

          <Link
            href="/menu"
            className={`text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-lg px-3 py-1.5 ${
              isActive("/menu") ? "text-black bg-gray-100 font-semibold" : "text-gray-600 hover:text-black hover:bg-gray-50"
            }`}
          >
            Menu
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                href="/order"
                className={`text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-lg px-3 py-1.5 ${
                  isActive("/order") ? "text-black bg-gray-100 font-semibold" : "text-gray-600 hover:text-black hover:bg-gray-50"
                }`}
              >
                Orders
              </Link>

              <Link
                href="/payment"
                className={`text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-lg px-3 py-1.5 ${
                  isActive("/payment") ? "text-black bg-gray-100 font-semibold" : "text-gray-600 hover:text-black hover:bg-gray-50"
                }`}
              >
                Riwayat Pembayaran
              </Link>

              {userRole === "boss" && (
                <>
                  <Link
                    href="/admin"
                    className={`text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-lg px-3 py-1.5 ${
                      isActive("/admin") && !isActive("/admin/assistant") ? "text-black bg-gray-100 font-semibold" : "text-gray-600 hover:text-black hover:bg-gray-50"
                    }`}
                  >
                    Admin
                  </Link>
                  <Link
                    href="/admin/assistant"
                    className={`text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-lg px-3 py-1.5 ${
                      isActive("/admin/assistant") ? "text-black bg-gray-100 font-semibold" : "text-gray-600 hover:text-black hover:bg-gray-50"
                    }`}
                  >
                    AI Assistant
                  </Link>
                </>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="ml-2 rounded-lg bg-red-50 border border-red-200 px-3.5 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-lg px-3 py-1.5 ${
                  isActive("/login") ? "text-black bg-gray-100 font-semibold" : "text-gray-600 hover:text-black hover:bg-gray-50"
                }`}
              >
                Login
              </Link>

              <Link
                href="/register"
                className="ml-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black transition"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black transition"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
        >
          {mobileMenuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Navigation Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-1.5 shadow-2xs">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block rounded-lg px-3 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
              isActive("/") ? "bg-gray-100 text-black" : "text-gray-800 hover:bg-gray-100"
            }`}
          >
            Home
          </Link>

          <Link
            href="/menu"
            onClick={() => setMobileMenuOpen(false)}
            className={`block rounded-lg px-3 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
              isActive("/menu") ? "bg-gray-100 text-black" : "text-gray-800 hover:bg-gray-100"
            }`}
          >
            Menu
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                href="/order"
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-lg px-3 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                  isActive("/order") ? "bg-gray-100 text-black" : "text-gray-800 hover:bg-gray-100"
                }`}
              >
                Orders
              </Link>

              <Link
                href="/payment"
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-lg px-3 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                  isActive("/payment") ? "bg-gray-100 text-black" : "text-gray-800 hover:bg-gray-100"
                }`}
              >
                Riwayat Pembayaran
              </Link>

              {userRole === "boss" && (
                <>
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block rounded-lg px-3 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                      isActive("/admin") && !isActive("/admin/assistant") ? "bg-gray-100 text-black" : "text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    Admin
                  </Link>
                  <Link
                    href="/admin/assistant"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block rounded-lg px-3 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                      isActive("/admin/assistant") ? "bg-gray-100 text-black" : "text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    AI Assistant
                  </Link>
                </>
              )}

              <div className="pt-2 border-t border-gray-100 mt-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-lg px-3 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                  isActive("/login") ? "bg-gray-100 text-black" : "text-gray-800 hover:bg-gray-100"
                }`}
              >
                Login
              </Link>

              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}