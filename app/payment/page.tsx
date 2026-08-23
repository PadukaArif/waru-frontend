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
  } catch (e) {
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
      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-6 py-12">
          <div className="mb-8">
            <div className="h-9 w-48 animate-pulse rounded bg-gray-200" />
            <div className="mt-3 h-5 w-64 animate-pulse rounded bg-gray-200" />
          </div>

          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="rounded-xl border p-5">
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
          <h1 className="text-2xl font-bold">Gagal memuat pembayaran</h1>
          <p className="mt-3 text-gray-600">{error}</p>
          <button
            type="button"
            onClick={() => loadPayments(page)}
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Riwayat Pembayaran</h1>
          <p className="mt-2 text-gray-600">Daftar transaksi pembayaran Waru.</p>
        </div>

        {payments.length === 0 ? (
          <div className="rounded-xl border p-10 text-center">
            <h2 className="text-lg font-semibold">Belum ada pembayaran</h2>
            <p className="mt-2 text-sm text-gray-500">
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
                  className="block rounded-xl border p-5 transition hover:shadow-md hover:bg-gray-50/50"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-lg font-semibold">
                          Meja {payment.tableNumber}
                        </h2>
                        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(payment.status)}`}>
                          {statusLabel(payment.status)}
                        </span>
                        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 uppercase border border-gray-200">
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
                      <p className="text-sm text-gray-500">Total Tagihan</p>
                      <p className="font-semibold text-lg text-gray-900">
                        {formatRupiah(payment.totalAmount)}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Bayar: {formatRupiah(payment.paidAmount)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                type="button"
                disabled={!hasPrev}
                onClick={() => loadPayments(page - 1)}
                className="rounded-lg border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:text-gray-400 hover:bg-gray-50"
              >
                ← Sebelumnya
              </button>

              <span className="text-sm text-gray-600 font-medium">
                Halaman {page} dari {totalPages}
              </span>

              <button
                type="button"
                disabled={!hasNext}
                onClick={() => loadPayments(page + 1)}
                className="rounded-lg border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:text-gray-400 hover:bg-gray-50"
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
