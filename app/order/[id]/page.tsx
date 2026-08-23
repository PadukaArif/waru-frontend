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
      <main className="flex-1">
        <section className="mx-auto w-full max-w-4xl px-6 py-12">
          <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />

          <div className="mt-6 overflow-hidden rounded-xl border">
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
      <main className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold">
            Gagal memuat order
          </h1>

          <p className="mt-3 text-gray-600">
            {error || "Order tidak ditemukan."}
          </p>

          <Link
            href={from === "payment" && paymentId ? `/payment/${paymentId}` : "/order"}
            className="mt-6 inline-block rounded-lg border px-5 py-3 font-medium hover:bg-gray-50"
          >
            {from === "payment" ? "← Kembali ke Riwayat Pembayaran" : "← Kembali ke Orders"}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-4xl px-6 py-12">
        {from === "payment" && paymentId ? (
          <Link
            href={`/payment/${paymentId}`}
            className="text-sm font-medium text-gray-600 hover:text-black"
          >
            ← Kembali ke Riwayat Pembayaran
          </Link>
        ) : (
          <Link
            href="/order"
            className="text-sm font-medium text-gray-600 hover:text-black"
          >
            ← Kembali ke Orders
          </Link>
        )}

        <div className="mt-6 overflow-hidden rounded-xl border">
          <div className="border-b p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Order
                </p>

                <h1 className="mt-1 text-2xl font-bold">
                  Meja {order.tableNumber}
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  {order.customerName || "Customer"}
                </p>
              </div>

              <span className="w-fit rounded-full border px-4 py-2 text-sm font-medium">
                {statusLabel(order.status)}
              </span>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-lg font-semibold">
              Pesanan
            </h2>

            <div className="mt-4 divide-y">
              {order.items.map((item) => (
                <div
                  key={item.menuId}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div>
                    <p className="font-medium">
                      {item.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {item.quantity} ×{" "}
                      {formatRupiah(item.price)}
                    </p>
                  </div>

                  <p className="font-medium">
                    {formatRupiah(item.subtotal)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t pt-5">
              <p className="text-lg font-semibold">
                Total
              </p>

              <p className="text-xl font-bold">
                {formatRupiah(order.totalAmount)}
              </p>
            </div>

            {order.status !== "completed" && order.status !== "cancelled" && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleOpenPaymentModal}
                  className="w-full rounded-xl bg-black py-4 font-semibold text-white hover:bg-gray-800 hover:shadow-md transition active:scale-[0.99]"
                >
                  Bayar Sekarang
                </button>
              </div>
            )}

            {order.notes && (
              <div className="mt-6 rounded-lg bg-gray-50 p-4">
                <p className="text-sm font-medium">
                  Catatan
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  {order.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modal Pembayaran */}
      {isPaymentModalOpen && order && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <h2 className="text-xl font-bold text-gray-900">Pembayaran</h2>
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {paymentError && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                {paymentError}
              </div>
            )}

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
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
                        className={`flex items-center justify-center rounded-xl border-2 py-3 px-4 text-sm font-medium transition ${
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
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Total Tagihan
                </label>
                <div className="rounded-xl bg-gray-50 border p-3.5 font-mono text-lg font-bold text-gray-900">
                  {formatRupiah(order.totalAmount)}
                </div>
              </div>

              <div>
                <label htmlFor="paidAmount" className="block text-sm font-semibold text-gray-700 mb-1">
                  Jumlah Bayar (Rp)
                </label>
                <input
                  id="paidAmount"
                  type="number"
                  required
                  min={0}
                  value={paidAmount || ""}
                  onChange={(e) => setPaidAmount(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 font-mono text-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition"
                  placeholder="Masukkan nominal bayar..."
                />
                {paymentMethod === "cash" && paidAmount < order.totalAmount && (
                  <p className="mt-1 text-xs text-red-500">
                    Jumlah bayar minimal {formatRupiah(order.totalAmount)}
                  </p>
                )}
              </div>

              {paymentMethod === "cash" && paidAmount >= order.totalAmount && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Kembalian
                  </label>
                  <div className="rounded-xl bg-green-50 border border-green-100 p-3.5 font-mono text-lg font-bold text-green-700">
                    {formatRupiah(changeAmount)}
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-1">
                  Catatan (Opsional)
                </label>
                <textarea
                  id="notes"
                  rows={2}
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition"
                  placeholder="Tambahkan catatan pembayaran jika ada..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  disabled={submittingPayment}
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="flex-1 rounded-xl border border-gray-300 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitDisabled}
                  className="flex-1 rounded-xl bg-black py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition"
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
        <div className="fixed bottom-5 right-5 z-50 max-w-sm rounded-xl bg-green-600 text-white p-4 shadow-lg border border-green-700 flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <svg className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-semibold">Pembayaran Sukses</p>
            <p className="text-xs text-green-100">Pesanan telah berhasil dibayar.</p>
          </div>
        </div>
      )}
    </main>
  );
}