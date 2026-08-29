"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getPayments, type Payment, type PaymentStatus, type PaymentMethod } from "@/services/payment";
import PageHeader from "@/components/UI/PageHeader";
import Button from "@/components/UI/Button";

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function methodLabel(method: PaymentMethod) {
  const labels: Record<PaymentMethod, string> = {
    cash: "Tunai (Cash)",
    transfer: "Transfer Bank",
    qris: "QRIS Direct",
    card: "Kartu Debit/Kredit",
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
    pending: "bg-amber-50 text-[#d99516] border-amber-200",
    paid: "bg-emerald-50 text-[#204d28] border-emerald-200 font-bold",
    failed: "bg-red-50 text-red-800 border-red-200 font-bold",
    refunded: "bg-slate-100 text-slate-700 border-slate-300",
  };
  return classes[status] || "bg-slate-100 text-slate-700 border-slate-200";
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
      <div className="page-container py-6 sm:py-8 md:py-10 space-y-6">
        <div className="border-b border-slate-200 pb-6 space-y-2">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-4 w-64 animate-pulse rounded-lg bg-slate-200" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
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
          <h1 className="text-xl font-bold text-[#293855]">Gagal Memuat Pembayaran</h1>
          <p className="text-xs sm:text-sm text-slate-600">{error}</p>
          <Button
            variant="primary"
            onClick={() => loadPayments(page)}
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
        title="Riwayat Pembayaran WARU"
        description="Audit dan catat seluruh riwayat transaksi pembayaran meja warung."
        badge="Audit & Transaksi Kasir"
      />

      {payments.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-xs space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-[#293855]">Belum Ada Riwayat Pembayaran</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Transaksi pembayaran yang telah diproses kasir akan muncul di sini.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {payments.map((payment) => (
              <Link
                key={payment._id}
                href={`/payment/${payment._id}`}
                className="group block rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-150 hover:border-slate-300 hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4265D6]"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="text-base sm:text-lg font-black text-[#293855] group-hover:text-[#4265D6] transition-colors">
                        Meja {payment.tableNumber}
                      </h2>
                      <span className={`rounded-md border px-2.5 py-0.5 text-xs font-semibold ${statusBadgeClass(payment.status)}`}>
                        {statusLabel(payment.status)}
                      </span>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-[#293855] border border-slate-200">
                        {methodLabel(payment.method)}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs font-mono text-slate-400 font-medium">
                      Order ID: {payment.orderId}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 font-semibold">
                      Waktu: {formatDate(payment.createdAt)}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-xs text-slate-400 font-semibold uppercase">Total Tagihan</p>
                    <p className="font-black text-base sm:text-lg text-[#293855]">
                      {formatRupiah(payment.totalAmount)}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500 font-semibold">
                      Dibayar: {formatRupiah(payment.paidAmount)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4 border-t border-slate-200/80 pt-6">
            <Button
              variant="outline"
              disabled={!hasPrev}
              onClick={() => loadPayments(page - 1)}
              className="min-h-[40px]"
            >
              ← Sebelumnya
            </Button>

            <span className="text-xs sm:text-sm font-semibold text-[#293855]">
              Halaman {page} dari {totalPages}
            </span>

            <Button
              variant="outline"
              disabled={!hasNext}
              onClick={() => loadPayments(page + 1)}
              className="min-h-[40px]"
            >
              Berikutnya →
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

