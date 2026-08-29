"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getOrders,
  type Order,
  type OrderStatus,
} from "@/services/order";

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function statusLabel(status: OrderStatus) {
  const labels: Record<OrderStatus, string> = {
    pending: "Pending",
    processing: "Diproses",
    completed: "Selesai",
    cancelled: "Dibatalkan",
  };

  return labels[status];
}

function statusBadgeClass(status: OrderStatus) {
  const classes: Record<OrderStatus, string> = {
    pending: "bg-amber-50 text-amber-800 border-amber-200",
    processing: "bg-blue-50 text-blue-800 border-blue-200",
    completed: "bg-emerald-50 text-emerald-800 border-emerald-200",
    cancelled: "bg-red-50 text-red-800 border-red-200",
  };
  return classes[status] || "bg-gray-100 text-gray-800 border-gray-200";
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrders(targetPage: number) {
    try {
      setLoading(true);
      setError("");

      const response = await getOrders(targetPage, 10);

      setOrders(response.data);
      setPage(response.meta.page);
      setTotalPages(Math.max(response.meta.totalPages, 1));
      setHasNext(response.meta.hasNext);
      setHasPrev(response.meta.hasPrev);
    } catch (error) {
      console.error("Failed to fetch orders:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Gagal memuat orders"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders(1);
  }, []);

  if (loading) {
    return (
      <main className="flex-1 bg-gray-50/30">
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
          <div className="mb-8 border-b border-gray-200 pb-6">
            <div className="h-8 w-36 animate-pulse rounded-lg bg-gray-200" />
            <div className="mt-2 h-4 w-60 animate-pulse rounded-lg bg-gray-200" />
          </div>

          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                  <div className="space-y-3">
                    <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
                  </div>

                  <div className="space-y-3 sm:text-right">
                    <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 flex items-center justify-center bg-gray-50/30 min-h-[60vh] px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-2xs">
          <h1 className="text-xl font-bold text-gray-900">
            Gagal memuat orders
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-gray-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() => loadOrders(page)}
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-gray-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black min-h-[44px]"
          >
            Coba Lagi
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-gray-50/30">
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">Orders</h1>

            <p className="mt-1.5 text-xs sm:text-sm text-gray-600">
              Daftar pesanan meja WARU.
            </p>
          </div>

          <Link
            href="/order/create"
            className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-gray-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black shadow-2xs text-center min-h-[44px]"
          >
            Buat Pesanan
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 sm:p-12 text-center shadow-2xs">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Belum ada pesanan
            </h2>

            <p className="mt-1.5 text-xs sm:text-sm text-gray-500">
              Pesanan yang dibuat akan muncul di sini.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {orders.map((order) => (
                <Link
                  key={order._id}
                  href={`/order/${order._id}`}
                  className="block rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-base sm:text-lg font-bold text-gray-900">
                          Meja {order.tableNumber}
                        </h2>

                        <span className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${statusBadgeClass(order.status)}`}>
                          {statusLabel(order.status)}
                        </span>
                      </div>

                      <p className="mt-1 text-xs sm:text-sm text-gray-500 font-medium">
                        {order.customerName || "Pelanggan"}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="font-bold text-base sm:text-lg text-gray-900">
                        {formatRupiah(order.totalAmount)}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-500 font-medium">
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-gray-100 pt-3">
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-600">
                      {order.items.map((item) => (
                        <span key={item.menuId} className="font-medium">
                          {item.name} × {item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 flex items-center justify-center gap-3 sm:gap-4">
              <button
                type="button"
                disabled={!hasPrev}
                onClick={() => loadOrders(page - 1)}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black min-h-[40px]"
              >
                ← Sebelumnya
              </button>

              <span className="text-xs sm:text-sm font-medium text-gray-600">
                Halaman {page} dari {totalPages}
              </span>

              <button
                type="button"
                disabled={!hasNext}
                onClick={() => loadOrders(page + 1)}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black min-h-[40px]"
              >
                Berikutnya →
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}