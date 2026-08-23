"use client";

import { useEffect } from "react";
import Link from "next/link";

interface MenuDetailErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function MenuDetailError({
  error,
  reset,
}: MenuDetailErrorProps) {
  useEffect(() => {
    console.error("Menu detail error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-bold">
          Gagal memuat detail menu
        </h1>

        <p className="mt-3 text-gray-600">
          Data menu tidak dapat dimuat saat ini.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-lg bg-black px-5 py-3 font-medium text-white transition hover:bg-gray-800"
          >
            Coba Lagi
          </button>

          <Link
            href="/menu"
            className="rounded-lg border px-5 py-3 font-medium transition hover:bg-gray-50"
          >
            Kembali
          </Link>
        </div>
      </div>
    </main>
  );
}