"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getOrderById,
  createPayment,
  type Order,
  type OrderStatus,
  type PaymentMethod,
} from "@/services/order";

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

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

export default function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const paymentId = searchParams.get("paymentId");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [paymentNotes, setPaymentNotes] = useState("");
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleOpenPaymentModal = () => {
    if (!order) return;
    setPaymentMethod("cash");
    setPaidAmount(order.totalAmount);
    setPaymentNotes("");
    setPaymentError("");
    setIsPaymentModalOpen(true);
  };

  const changeAmount = paymentMethod === "cash" ? Math.max(0, paidAmount - (order?.totalAmount ?? 0)) : 0;
  const isPaidAmountValid = paymentMethod !== "cash" || paidAmount >= (order?.totalAmount ?? 0);
  const isSubmitDisabled = submittingPayment || !isPaidAmountValid || paidAmount <= 0;

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    if (paymentMethod === "cash" && paidAmount < order.totalAmount) {
      setPaymentError(`Jumlah bayar kurang dari total tagihan ${formatRupiah(order.totalAmount)}`);
      return;
    }

    try {
      setSubmittingPayment(true);
      setPaymentError("");

      await createPayment({
        orderId: order._id,
        paidAmount,
        method: paymentMethod,
        notes: paymentNotes || undefined,
      });

      setShowSuccessToast(true);
      setIsPaymentModalOpen(false);

      const updatedOrder = await getOrderById(order._id);
      setOrder(updatedOrder);

      setTimeout(() => {
        setShowSuccessToast(false);
      }, 4000);
    } catch (error) {
      console.error("Payment failed:", error);
      setPaymentError(
        error instanceof Error ? error.message : "Terjadi kesalahan saat memproses pembayaran"
      );
    } finally {
      setSubmittingPayment(false);
    }
  };

  useEffect(() => {
    async function loadOrder() {
      try {
        const { id } = await params;

        const response = await getOrderById(id);

        setOrder(response);
      } catch (error) {
        console.error("Failed to fetch order:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Gagal memuat detail order"
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [params]);

  if (loading) {
    return (
      <main className="flex-1 bg-gray-50/30">
        <section className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
          <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />

          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xs">
            <div className="space-y-5 p-6">
              <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
              <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
              <div className="h-px bg-gray-200" />
              <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
              <div className="h-5 w-full animate-pulse rounded bg-gray-200" />
              <div className="h-5 w-4/5 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="flex-1 flex items-center justify-center bg-gray-50/30 min-h-[60vh] px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-2xs">
          <h1 className="text-xl font-bold text-gray-900">
            Gagal memuat order
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-gray-600">
            {error || "Order tidak ditemukan."}
          </p>

          <Link
            href={from === "payment" && paymentId ? `/payment/${paymentId}` : "/order"}
            className="mt-6 inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black min-h-[44px]"
          >
            {from === "payment" ? "← Kembali ke Riwayat Pembayaran" : "← Kembali ke Orders"}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-gray-50/30">
      <section className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
        {from === "payment" && paymentId ? (
          <Link
            href={`/payment/${paymentId}`}
            className="inline-flex items-center text-xs sm:text-sm font-semibold text-gray-600 hover:text-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded px-1"
          >
            ← Kembali ke Riwayat Pembayaran
          </Link>
        ) : (
          <Link
            href="/order"
            className="inline-flex items-center text-xs sm:text-sm font-semibold text-gray-600 hover:text-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded px-1"
          >
            ← Kembali ke Orders
          </Link>
        )}

        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xs">
          <div className="border-b border-gray-200 p-6 bg-gray-50/50">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Pesanan Meja
                </p>

                <h1 className="mt-1 text-2xl font-extrabold text-gray-900">
                  Meja {order.tableNumber}
                </h1>

                <p className="mt-1 text-xs text-gray-500 font-medium">
                  {order.customerName || "Pelanggan"}
                </p>
              </div>

              <span className={`w-fit rounded-full border px-4 py-1 text-xs font-semibold ${statusBadgeClass(order.status)}`}>
                {statusLabel(order.status)}
              </span>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Rincian Pesanan
            </h2>

            <div className="mt-4 divide-y divide-gray-100 border-y border-gray-100">
              {order.items.map((item) => (
                <div
                  key={item.menuId}
                  className="flex items-center justify-between gap-4 py-3.5"
                >
                  <div>
                    <p className="font-semibold text-xs sm:text-sm text-gray-900">
                      {item.name}
                    </p>

                    <p className="mt-0.5 text-xs text-gray-500 font-medium">
                      {item.quantity} × {formatRupiah(item.price)}
                    </p>
                  </div>

                  <p className="font-bold text-xs sm:text-sm text-gray-900">
                    {formatRupiah(item.subtotal)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-5">
              <p className="text-base sm:text-lg font-bold text-gray-900">
                Total Tagihan
              </p>

              <p className="text-xl sm:text-2xl font-extrabold text-gray-900">
                {formatRupiah(order.totalAmount)}
              </p>
            </div>

            {order.status !== "completed" && order.status !== "cancelled" && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleOpenPaymentModal}
                  className="w-full rounded-xl bg-black py-3.5 text-xs sm:text-sm font-semibold text-white hover:bg-gray-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black min-h-[44px] shadow-2xs"
                >
                  Bayar Sekarang
                </button>
              </div>
            )}

            {order.notes && (
              <div className="mt-6 rounded-xl bg-gray-50 border border-gray-200 p-4 text-xs sm:text-sm">
                <p className="font-semibold text-gray-800">
                  Catatan
                </p>

                <p className="mt-1 text-gray-600">
                  {order.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modal Pembayaran */}
      {isPaymentModalOpen && order && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Pembayaran</h2>
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                aria-label="Tutup modal pembayaran"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {paymentError && (
              <div className="mb-4 rounded-xl bg-red-50 p-3.5 text-xs sm:text-sm text-red-800 border border-red-200">
                {paymentError}
              </div>
            )}

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  Metode Pembayaran
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["cash", "transfer", "qris", "card"] as const).map((method) => {
                    const labels: Record<PaymentMethod, string> = {
                      cash: "Cash",
                      transfer: "Transfer",
                      qris: "QRIS",
                      card: "Card",
                    };
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => {
                          setPaymentMethod(method);
                          if (method !== "cash") {
                            setPaidAmount(order.totalAmount);
                          }
                        }}
                        className={`flex items-center justify-center rounded-xl border-2 py-2.5 px-3 text-xs sm:text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black min-h-[40px] ${
                          paymentMethod === method
                            ? "border-black bg-black text-white"
                            : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {labels[method]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  Total Tagihan
                </label>
                <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 font-mono text-base font-bold text-gray-900">
                  {formatRupiah(order.totalAmount)}
                </div>
              </div>

              <div>
                <label htmlFor="paidAmount" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  Jumlah Bayar (Rp)
                </label>
                <input
                  id="paidAmount"
                  type="number"
                  required
                  min={0}
                  value={paidAmount || ""}
                  onChange={(e) => setPaidAmount(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 font-mono text-base font-semibold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:border-transparent transition"
                  placeholder="Masukkan nominal bayar..."
                />
                {paymentMethod === "cash" && paidAmount < order.totalAmount && (
                  <p className="mt-1 text-xs text-red-500 font-medium">
                    Jumlah bayar minimal {formatRupiah(order.totalAmount)}
                  </p>
                )}
              </div>

              {paymentMethod === "cash" && paidAmount >= order.totalAmount && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">
                    Kembalian
                  </label>
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 font-mono text-base font-extrabold text-emerald-800">
                    {formatRupiah(changeAmount)}
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="notes" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  Catatan (Opsional)
                </label>
                <textarea
                  id="notes"
                  rows={2}
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:border-transparent transition"
                  placeholder="Catatan pembayaran..."
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={submittingPayment}
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="flex-1 rounded-xl border border-gray-300 bg-white py-2.5 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black min-h-[42px]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitDisabled}
                  className="flex-1 rounded-xl bg-black py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black min-h-[42px]"
                >
                  {submittingPayment ? "Memproses..." : "Konfirmasi Bayar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Notification Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm rounded-xl bg-black text-white p-4 shadow-xl border border-gray-800 flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <svg className="h-5 w-5 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-xs sm:text-sm font-bold">Pembayaran Sukses</p>
            <p className="text-[11px] text-gray-300">Pesanan telah berhasil dibayar.</p>
          </div>
        </div>
      )}
    </main>
  );
}