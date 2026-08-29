import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white py-6 sm:py-8 text-xs sm:text-sm text-[#293855]">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <span className="font-extrabold tracking-tight text-[#293855]">
            WARU
          </span>
          <p className="text-xs text-slate-500">
            Warung Analytics Resource Utility • Multi-Outlet & POS System
          </p>
        </div>

        <nav className="flex flex-wrap justify-center gap-4 sm:gap-6 text-slate-600 font-medium">
          <Link
            href="/"
            className="hover:text-[#4265D6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4265D6] rounded px-1 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/menu"
            className="hover:text-[#4265D6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4265D6] rounded px-1 transition-colors"
          >
            Menu
          </Link>
          <Link
            href="/order"
            className="hover:text-[#4265D6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4265D6] rounded px-1 transition-colors"
          >
            Orders
          </Link>
          <Link
            href="/login"
            className="hover:text-[#4265D6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4265D6] rounded px-1 transition-colors"
          >
            Login
          </Link>
        </nav>

        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} WARU. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
