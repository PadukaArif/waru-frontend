"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getPaymentById, type Payment, type PaymentStatus, type PaymentMethod } from "@/services/payment";
import Button from "@/components/UI/Button";

interface PaymentDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

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
    pending: "bg-amber-50 text-amber-hover border-amber-200",
    paid: "bg-emerald-50 text-green-dark border-emerald-200 font-bold",
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
      second: "2-digit"
    });
  } catch {
    return dateStr;
  }
}

export default function PaymentDetailPage({ params }: PaymentDetailPageProps) {
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPayment() {
      try {
        const { id } = await params;
        const data = await getPaymentById(id);
        setPayment(data);
      } catch (err) {
        console.error("Failed to fetch payment:", err);
        setError(
          err instanceof Error ? err.message : "Gagal memuat detail pembayaran"
        );
      } finally {
        setLoading(false);
      }
    }

    loadPayment();
  }, [params]);

  if (loading) {
    return (
      <div className="page-container py-6 sm:py-8 md:py-10 max-w-2xl space-y-6">
        <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="space-y-5 p-6 sm:p-8">
            <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
            <div className="h-px bg-slate-100" />
            <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-full animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="page-container py-12 flex items-center justify-center min-h-[50vh]">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs space-y-4">
          <h1 className="text-xl font-bold text-navy">Gagal Memuat Detail Pembayaran</h1>
          <p className="text-xs sm:text-sm text-slate-600">{error || "Detail pembayaran tidak ditemukan."}</p>
          <Link href="/payment">
            <Button variant="outline">
              ← Kembali ke Riwayat Pembayaran
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container py-6 sm:py-8 md:py-10 max-w-2xl space-y-6">
      <Link
        href="/payment"
        className="inline-flex items-center text-xs sm:text-sm font-semibold text-blue-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-primary rounded px-1"
      >
        ← Kembali ke Riwayat Pembayaran
      </Link>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="border-b border-slate-200 p-6 bg-slate-50/60">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Audit Pembayaran Kasir
              </p>
              <h1 className="mt-1 text-2xl sm:text-3xl font-black text-navy">
                Meja {payment.tableNumber}
              </h1>
              <p className="mt-1 text-xs text-slate-500 font-mono">
                ID Transaksi: {payment._id}
              </p>
            </div>

            <span className={`w-fit rounded-md border px-3.5 py-1 text-xs font-semibold ${statusBadgeClass(payment.status)}`}>
              Status: {statusLabel(payment.status)}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs sm:text-sm border-b border-slate-100 pb-6">
            <div>
              <p className="text-slate-400 font-semibold uppercase text-[10px]">Metode Pembayaran</p>
              <p className="mt-1 font-bold text-navy">
                {methodLabel(payment.method)}
              </p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold uppercase text-[10px]">Tanggal & Waktu</p>
              <p className="mt-1 font-semibold text-navy">
                {formatDate(payment.createdAt)}
              </p>
            </div>
            <div className="col-span-2 pt-2 border-t border-slate-100">
              <p className="text-slate-400 font-semibold uppercase text-[10px]">Referensi Pesanan Meja</p>
              <Link
                href={`/order/${payment.orderId}?from=payment&paymentId=${payment._id}`}
                className="mt-1 inline-flex items-center gap-1.5 font-bold text-blue-primary hover:underline transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-primary rounded"
              >
                Lihat Detail Pesanan (Order ID: {payment.orderId})
                <svg className="h-4 w-4 text-blue-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="space-y-3 border-b border-slate-100 pb-6">
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-slate-500 font-semibold">Total Tagihan Pesanan</span>
              <span className="font-bold text-navy">{formatRupiah(payment.totalAmount)}</span>
            </div>
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-slate-500 font-semibold">Nominal Dibayar</span>
              <span className="font-bold text-navy">{formatRupiah(payment.paidAmount)}</span>
            </div>
            <div className="flex justify-between items-center text-base sm:text-lg font-black pt-3.5 border-t border-slate-100">
              <span className="text-navy">Kembalian (Change)</span>
              <span className="text-green-dark font-black">{formatRupiah(payment.changeAmount)}</span>
            </div>
          </div>

          {payment.notes && (
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs sm:text-sm space-y-1">
              <p className="font-bold text-navy">Catatan Transaksi</p>
              <p className="text-slate-600">{payment.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

