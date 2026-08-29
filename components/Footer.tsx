export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white py-6 sm:py-8 text-xs sm:text-sm text-[#293855]">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-1 sm:items-start text-center sm:text-left">
          <span className="font-extrabold tracking-tight text-[#293855]">
            WARU
          </span>
          <p className="text-xs text-slate-500">
            Warung Analytics Resource Utility • Multi-Outlet & POS System
          </p>
        </div>

        <p className="text-xs text-slate-400 shrink-0">
          © {new Date().getFullYear()} WARU. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
