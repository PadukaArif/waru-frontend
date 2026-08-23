"use client";

import { useEffect } from "react";

interface OrdersErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function OrdersError({
  error,
  reset,
}: OrdersErrorProps) {
  useEffect(() => {
    console.error("Orders error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-bold">
          Gagal memuat orders
        </h1>

        <p className="mt-3 text-gray-600">
          Data pesanan tidak dapat dimuat saat ini.
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-lg bg-black px-5 py-3 font-medium text-white hover:bg-gray-800"
        >
          Coba Lagi
        </button>
      </div>
    </main>
  );
}