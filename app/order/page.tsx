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
      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-6 py-12">
          <div className="mb-8">
            <div className="h-9 w-32 animate-pulse rounded bg-gray-200" />
            <div className="mt-3 h-5 w-64 animate-pulse rounded bg-gray-200" />
          </div>

          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="rounded-xl border p-5"
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
      <main className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold">
            Gagal memuat orders
          </h1>

          <p className="mt-3 text-gray-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() => loadOrders(page)}
            className="mt-6 rounded-lg bg-black px-5 py-3 font-medium text-white hover:bg-gray-800"
          >
            Coba Lagi
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Orders</h1>

            <p className="mt-2 text-gray-600">
              Daftar pesanan Waru.
            </p>
          </div>

          <Link
            href="/order/create"
            className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition shadow-sm text-center"
          >
            Buat Pesanan
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-xl border p-10 text-center">
            <h2 className="text-lg font-semibold">
              Belum ada pesanan
            </h2>

            <p className="mt-2 text-sm text-gray-500">
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
                  className="block rounded-xl border p-5 transition hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-lg font-semibold">
                          Meja {order.tableNumber}
                        </h2>

                        <span className="rounded-full border px-3 py-1 text-xs font-medium">
                          {statusLabel(order.status)}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-gray-500">
                        {order.customerName || "Customer"}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="font-semibold">
                        {formatRupiah(order.totalAmount)}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 border-t pt-4">
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                      {order.items.map((item) => (
                        <span key={item.menuId}>
                          {item.name} × {item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                type="button"
                disabled={!hasPrev}
                onClick={() => loadOrders(page - 1)}
                className="rounded-lg border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:text-gray-400"
              >
                ← Sebelumnya
              </button>

              <span className="text-sm text-gray-600">
                Halaman {page} dari {totalPages}
              </span>

              <button
                type="button"
                disabled={!hasNext}
                onClick={() => loadOrders(page + 1)}
                className="rounded-lg border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:text-gray-400"
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