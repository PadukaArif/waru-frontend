"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getOrders,
  type Order,
  type OrderStatus,
} from "@/services/order";
import PageHeader from "@/components/UI/PageHeader";
import Button from "@/components/UI/Button";

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
    pending: "bg-amber-50 text-amber-hover border-amber-200",
    processing: "bg-blue-50 text-blue-primary border-blue-200",
    completed: "bg-emerald-50 text-green-dark border-emerald-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };
  return classes[status] || "bg-slate-100 text-slate-700 border-slate-200";
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
      <div className="page-container py-6 sm:py-8 md:py-10 space-y-6">
        <div className="border-b border-slate-200 pb-6 space-y-2">
          <div className="h-8 w-44 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-4 w-64 animate-pulse rounded-lg bg-slate-200" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                <div className="space-y-3">
                  <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
                </div>

                <div className="space-y-3 sm:text-right">
                  <div className="h-6 w-32 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container py-12 flex items-center justify-center min-h-[50vh]">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs space-y-4">
          <h1 className="text-xl font-bold text-navy">
            Gagal Memuat Pesanan
          </h1>

          <p className="text-xs sm:text-sm text-slate-600">
            {error}
          </p>

          <Button
            variant="primary"
            onClick={() => loadOrders(page)}
          >
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container py-6 sm:py-8 md:py-10">
      <PageHeader
        title="Daftar Pesanan WARU"
        description="Pantau dan kelola seluruh pesanan meja pelanggan secara real-time."
        badge="POS & Transaksi Meja"
        action={
          <Link href="/order/create">
            <Button variant="primary">
              + Buat Pesanan Baru
            </Button>
          </Link>
        }
      />

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-xs space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-navy">
            Belum Ada Pesanan Aktif
          </h2>

          <p className="text-xs sm:text-sm text-slate-500">
            Pesanan meja yang baru dibuat akan muncul di sini.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order._id}
                href={`/order/${order._id}`}
                className="group block rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-150 hover:border-slate-300 hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-primary"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-base sm:text-lg font-black text-navy group-hover:text-blue-primary transition-colors">
                        Meja {order.tableNumber}
                      </h2>

                      <span className={`rounded-md border px-3 py-0.5 text-xs font-semibold ${statusBadgeClass(order.status)}`}>
                        {statusLabel(order.status)}
                      </span>
                    </div>

                    <p className="mt-1 text-xs sm:text-sm text-slate-500 font-semibold">
                      Pemesan: {order.customerName || "Pelanggan Umum"}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="font-black text-base sm:text-lg text-navy">
                      {formatRupiah(order.totalAmount)}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400 font-semibold">
                      {order.items.length} jenis item
                    </p>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-3">
                  <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                    {order.items.map((item) => (
                      <span
                        key={item.menuId}
                        className="font-medium bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md"
                      >
                        {item.name} <strong className="text-navy">× {item.quantity}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4 border-t border-slate-200/80 pt-6">
            <Button
              variant="outline"
              disabled={!hasPrev}
              onClick={() => loadOrders(page - 1)}
              className="min-h-10"
            >
              ← Sebelumnya
            </Button>

            <span className="text-xs sm:text-sm font-semibold text-navy">
              Halaman {page} dari {totalPages}
            </span>

            <Button
              variant="outline"
              disabled={!hasNext}
              onClick={() => loadOrders(page + 1)}
              className="min-h-10"
            >
              Berikutnya →
            </Button>
          </div>
        </>
      )}
    </div>
  );
}