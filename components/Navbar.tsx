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
    <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-xs sticky top-0 z-40 h-16 flex items-center">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4265D6] rounded-lg px-2 py-1 transition-colors group">
          <span className="text-xl font-black tracking-tight text-[#293855] group-hover:text-[#4265D6] transition-colors">
            WARU
          </span>
          <span className="hidden sm:inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#4265D6] border border-blue-100 uppercase tracking-wider">
            POS
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1.5">
          <Link
            href="/"
            className={`text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4265D6] rounded-lg px-3 py-1.5 ${
              isActive("/") ? "text-[#4265D6] bg-blue-50/80 font-bold" : "text-slate-600 hover:text-[#293855] hover:bg-slate-100/70 font-medium"
            }`}
          >
            Home
          </Link>

          <Link
            href="/menu"
            className={`text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4265D6] rounded-lg px-3 py-1.5 ${
              isActive("/menu") ? "text-[#4265D6] bg-blue-50/80 font-bold" : "text-slate-600 hover:text-[#293855] hover:bg-slate-100/70 font-medium"
            }`}
          >
            Menu
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                href="/order"
                className={`text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4265D6] rounded-lg px-3 py-1.5 ${
                  isActive("/order") ? "text-[#4265D6] bg-blue-50/80 font-bold" : "text-slate-600 hover:text-[#293855] hover:bg-slate-100/70 font-medium"
                }`}
              >
                Orders
              </Link>

              <Link
                href="/payment"
                className={`text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4265D6] rounded-lg px-3 py-1.5 ${
                  isActive("/payment") ? "text-[#4265D6] bg-blue-50/80 font-bold" : "text-slate-600 hover:text-[#293855] hover:bg-slate-100/70 font-medium"
                }`}
              >
                Riwayat Pembayaran
              </Link>

              {userRole === "boss" && (
                <>
                  <Link
                    href="/admin"
                    className={`text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4265D6] rounded-lg px-3 py-1.5 ${
                      isActive("/admin") && !isActive("/admin/assistant") ? "text-[#4265D6] bg-blue-50/80 font-bold" : "text-slate-600 hover:text-[#293855] hover:bg-slate-100/70 font-medium"
                    }`}
                  >
                    Admin
                  </Link>
                  <Link
                    href="/admin/assistant"
                    className={`text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4265D6] rounded-lg px-3 py-1.5 ${
                      isActive("/admin/assistant") ? "text-[#4265D6] bg-blue-50/80 font-bold" : "text-slate-600 hover:text-[#293855] hover:bg-slate-100/70 font-medium"
                    }`}
                  >
                    AI Assistant
                  </Link>
                </>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="ml-2 rounded-lg bg-red-50 border border-red-200 px-3.5 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 transition cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4265D6] rounded-lg px-3 py-1.5 ${
                  isActive("/login") ? "text-[#4265D6] bg-blue-50/80 font-bold" : "text-slate-600 hover:text-[#293855] hover:bg-slate-100/70 font-medium"
                }`}
              >
                Login
              </Link>

              <Link
                href="/register"
                className="ml-2 rounded-lg bg-[#4265D6] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3352bc] active:bg-[#2844a4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#4265D6] transition shadow-xs"
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
          className="md:hidden p-2 rounded-lg text-[#293855] hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4265D6] transition cursor-pointer"
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
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1.5 shadow-xs">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block rounded-lg px-3 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4265D6] ${
              isActive("/") ? "bg-blue-50/80 text-[#4265D6]" : "text-[#293855] hover:bg-slate-100/70"
            }`}
          >
            Home
          </Link>

          <Link
            href="/menu"
            onClick={() => setMobileMenuOpen(false)}
            className={`block rounded-lg px-3 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4265D6] ${
              isActive("/menu") ? "bg-blue-50/80 text-[#4265D6]" : "text-[#293855] hover:bg-slate-100/70"
            }`}
          >
            Menu
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                href="/order"
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-lg px-3 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4265D6] ${
                  isActive("/order") ? "bg-blue-50/80 text-[#4265D6]" : "text-[#293855] hover:bg-slate-100/70"
                }`}
              >
                Orders
              </Link>

              <Link
                href="/payment"
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-lg px-3 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4265D6] ${
                  isActive("/payment") ? "bg-blue-50/80 text-[#4265D6]" : "text-[#293855] hover:bg-slate-100/70"
                }`}
              >
                Riwayat Pembayaran
              </Link>

              {userRole === "boss" && (
                <>
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block rounded-lg px-3 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4265D6] ${
                      isActive("/admin") && !isActive("/admin/assistant") ? "bg-blue-50/80 text-[#4265D6]" : "text-[#293855] hover:bg-slate-100/70"
                    }`}
                  >
                    Admin
                  </Link>
                  <Link
                    href="/admin/assistant"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block rounded-lg px-3 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4265D6] ${
                      isActive("/admin/assistant") ? "bg-blue-50/80 text-[#4265D6]" : "text-[#293855] hover:bg-slate-100/70"
                    }`}
                  >
                    AI Assistant
                  </Link>
                </>
              )}

              <div className="pt-2 border-t border-slate-100 mt-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 cursor-pointer"
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
                className={`block rounded-lg px-3 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4265D6] ${
                  isActive("/login") ? "bg-blue-50/80 text-[#4265D6]" : "text-[#293855] hover:bg-slate-100/70"
                }`}
              >
                Login
              </Link>

              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg bg-[#4265D6] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#3352bc] text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#4265D6] shadow-xs"
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