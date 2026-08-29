"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getPayments, type Payment, type PaymentStatus, type PaymentMethod } from "@/services/payment";

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function methodLabel(method: PaymentMethod) {
  const labels: Record<PaymentMethod, string> = {
    cash: "Cash",
    transfer: "Transfer",
    qris: "QRIS",
    card: "Card",
  };
  return labels[method] || method;
}

function statusLabel(status: PaymentStatus) {
  const labels: Record<PaymentStatus, string> = {
    pending: "Pending",
    paid: "Lunas",
    failed: "Gagal",
    refunded: "Refunded",
  };
  return labels[status] || status;
}

function statusBadgeClass(status: PaymentStatus) {
  const classes: Record<PaymentStatus, string> = {
    pending: "bg-gray-100 text-gray-800 border-gray-200",
    paid: "bg-green-100 text-green-800 border-green-200",
    failed: "bg-red-100 text-red-800 border-red-200",
    refunded: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };
  return classes[status] || "bg-gray-100 text-gray-800 border-gray-200";
}

function formatDate(dateStr: string) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPayments(targetPage: number) {
    try {
      setLoading(true);
      setError("");

      const response = await getPayments(targetPage, 10);

      setPayments(response.data);
      setPage(response.meta.page);
      setTotalPages(Math.max(response.meta.totalPages, 1));
      setHasNext(response.meta.hasNext);
      setHasPrev(response.meta.hasPrev);
    } catch (err) {
      console.error("Failed to fetch payments:", err);
      setError(
        err instanceof Error ? err.message : "Gagal memuat riwayat pembayaran"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPayments(1);
  }, []);

  if (loading) {
    return (
      <main className="flex-1 bg-gray-50/30">
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
          <div className="mb-8 border-b border-gray-200 pb-6">
            <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200" />
            <div className="mt-2 h-4 w-60 animate-pulse rounded-lg bg-gray-200" />
          </div>

          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
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
          <h1 className="text-xl font-bold text-gray-900">Gagal memuat pembayaran</h1>
          <p className="mt-2 text-xs sm:text-sm text-gray-600">{error}</p>
          <button
            type="button"
            onClick={() => loadPayments(page)}
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
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">Riwayat Pembayaran</h1>
          <p className="mt-1.5 text-xs sm:text-sm text-gray-600">Daftar transaksi pembayaran WARU.</p>
        </div>

        {payments.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 sm:p-12 text-center shadow-2xs">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Belum ada pembayaran</h2>
            <p className="mt-1.5 text-xs sm:text-sm text-gray-500">
              Transaksi pembayaran yang selesai akan muncul di sini.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {payments.map((payment) => (
                <Link
                  key={payment._id}
                  href={`/payment/${payment._id}`}
                  className="block rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h2 className="text-base sm:text-lg font-bold text-gray-900">
                          Meja {payment.tableNumber}
                        </h2>
                        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusBadgeClass(payment.status)}`}>
                          {statusLabel(payment.status)}
                        </span>
                        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600 uppercase border border-gray-200">
                          {methodLabel(payment.method)}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs font-mono text-gray-400">
                        Order ID: {payment.orderId}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {formatDate(payment.createdAt)}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-xs text-gray-500 font-medium">Total Tagihan</p>
                      <p className="font-bold text-base sm:text-lg text-gray-900">
                        {formatRupiah(payment.totalAmount)}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500 font-medium">
                        Bayar: {formatRupiah(payment.paidAmount)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 flex items-center justify-center gap-3 sm:gap-4">
              <button
                type="button"
                disabled={!hasPrev}
                onClick={() => loadPayments(page - 1)}
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
                onClick={() => loadPayments(page + 1)}
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
