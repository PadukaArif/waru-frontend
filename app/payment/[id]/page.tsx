"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getPaymentById, type Payment, type PaymentStatus, type PaymentMethod } from "@/services/payment";

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
      second: "2-digit"
    });
  } catch (e) {
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
      <main className="flex-1">
        <section className="mx-auto w-full max-w-2xl px-6 py-12">
          <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
          <div className="mt-6 overflow-hidden rounded-xl border">
            <div className="space-y-5 p-6">
              <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
              <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
              <div className="h-px bg-gray-200" />
              <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
              <div className="h-5 w-full animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error || !payment) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold">Gagal memuat detail pembayaran</h1>
          <p className="mt-3 text-gray-600">{error || "Detail pembayaran tidak ditemukan."}</p>
          <Link
            href="/payment"
            className="mt-6 inline-block rounded-lg border px-5 py-3 font-medium hover:bg-gray-50"
          >
            ← Kembali ke Riwayat Pembayaran
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-2xl px-6 py-12">
        <Link
          href="/payment"
          className="text-sm font-medium text-gray-600 hover:text-black"
        >
          ← Kembali ke Riwayat Pembayaran
        </Link>

        <div className="mt-6 overflow-hidden rounded-2xl border shadow-sm bg-white">
          <div className="border-b p-6 bg-gray-50/50">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Transaksi Pembayaran
                </p>
                <h1 className="mt-1 text-2xl font-bold text-gray-900">
                  Meja {payment.tableNumber}
                </h1>
                <p className="mt-1 text-xs text-gray-500 font-mono">
                  ID Transaksi: {payment._id}
                </p>
              </div>

              <span className={`w-fit rounded-full border px-4 py-1.5 text-sm font-medium ${statusBadgeClass(payment.status)}`}>
                {statusLabel(payment.status)}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm border-b pb-6">
              <div>
                <p className="text-gray-500 font-medium">Metode Pembayaran</p>
                <p className="mt-1 font-semibold text-gray-900 uppercase">
                  {methodLabel(payment.method)}
                </p>
              </div>
              <div>
                <p className="text-gray-500 font-medium">Tanggal Transaksi</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {formatDate(payment.createdAt)}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500 font-medium">Referensi Pesanan</p>
                <Link
                  href={`/order/${payment.orderId}?from=payment&paymentId=${payment._id}`}
                  className="mt-1 inline-flex items-center gap-1.5 font-semibold text-indigo-600 hover:text-indigo-800 transition underline decoration-dotted"
                >
                  Lihat Pesanan
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="space-y-3.5 border-b pb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Total Tagihan</span>
                <span className="font-semibold text-gray-900">{formatRupiah(payment.totalAmount)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Jumlah Dibayar</span>
                <span className="font-semibold text-gray-900">{formatRupiah(payment.paidAmount)}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold pt-3.5 border-t">
                <span className="text-gray-900">Kembalian</span>
                <span className="text-green-600">{formatRupiah(payment.changeAmount)}</span>
              </div>
            </div>

            {payment.notes && (
              <div className="rounded-xl bg-gray-50 border p-4 text-sm">
                <p className="font-semibold text-gray-700">Catatan Pembayaran</p>
                <p className="mt-1 text-gray-600">{payment.notes}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
