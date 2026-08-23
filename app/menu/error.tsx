"use client";

import { useEffect } from "react";

interface MenuErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function MenuError({
  error,
  reset,
}: MenuErrorProps) {
  useEffect(() => {
    console.error("Menu error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-bold">
          Gagal memuat menu
        </h1>

        <p className="mt-3 text-gray-600">
          Terjadi masalah saat mengambil data menu.
          Silakan coba lagi.
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-lg bg-black px-5 py-3 font-medium text-white transition hover:bg-gray-800"
        >
          Coba Lagi
        </button>
      </div>
    </main>
  );
}