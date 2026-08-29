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
import {
  getPaymentByOrderId,
  type Payment,
} from "@/services/payment";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";

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
    pending: "bg-amber-50 text-[#d99516] border-amber-200",
    processing: "bg-blue-50 text-[#4265D6] border-blue-200",
    completed: "bg-emerald-50 text-[#204d28] border-emerald-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };
  return classes[status] || "bg-slate-100 text-slate-700 border-slate-200";
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
  const [activePayment, setActivePayment] = useState<Payment | null>(null);

  const handleOpenPaymentModal = () => {
    if (!order) return;
    setPaymentMethod("cash");
    setPaidAmount(order.totalAmount);
    setPaymentNotes("");
    setPaymentError("");
    setActivePayment(null);
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

      if (paymentMethod === "cash") {
        setShowSuccessToast(true);
        setIsPaymentModalOpen(false);

        const updatedOrder = await getOrderById(order._id);
        setOrder(updatedOrder);

        setTimeout(() => {
          setShowSuccessToast(false);
        }, 4000);
      } else {
        // QRIS Flow
        const paymentData = await getPaymentByOrderId(order._id);
        setActivePayment(paymentData);
      }
    } catch (error) {
      console.warn("Payment failed:", error);
      const errMsg = error instanceof Error ? error.message : "Terjadi kesalahan saat memproses pembayaran";
      setPaymentError(errMsg);
    } finally {
      setSubmittingPayment(false);
    }
  };

  // Polling check status pembayaran QRIS
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;

    if (isPaymentModalOpen && activePayment && activePayment.method === "qris" && activePayment.status === "pending") {
      intervalId = setInterval(async () => {
        try {
          const paymentData = await getPaymentByOrderId(order?._id || "");
          if (paymentData && paymentData.status === "paid") {
            setActivePayment(null);
            setIsPaymentModalOpen(false);
            setShowSuccessToast(true);

            const updatedOrder = await getOrderById(order?._id || "");
            setOrder(updatedOrder);

            setTimeout(() => {
              setShowSuccessToast(false);
            }, 4000);
          }
        } catch (err) {
          console.warn("Polling payment status failed:", err);
        }
      }, 2000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPaymentModalOpen, activePayment, order?._id]);

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
      <div className="page-container py-6 sm:py-8 md:py-10 max-w-4xl space-y-6">
        <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="space-y-5 p-6 sm:p-8">
            <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
            <div className="h-px bg-slate-100" />
            <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-full animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-4/5 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="page-container py-12 flex items-center justify-center min-h-[50vh]">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs space-y-4">
          <h1 className="text-xl font-bold text-[#293855]">
            Gagal Memuat Detail Pesanan
          </h1>

          <p className="text-xs sm:text-sm text-slate-600">
            {error || "Pesanan tidak ditemukan."}
          </p>

          <Link href={from === "payment" && paymentId ? `/payment/${paymentId}` : "/order"}>
            <Button variant="outline">
              {from === "payment" ? "← Kembali ke Riwayat Pembayaran" : "← Kembali ke Daftar Pesanan"}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container py-6 sm:py-8 md:py-10 max-w-4xl space-y-6">
      {from === "payment" && paymentId ? (
        <Link
          href={`/payment/${paymentId}`}
          className="inline-flex items-center text-xs sm:text-sm font-semibold text-[#4265D6] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4265D6] rounded px-1"
        >
          ← Kembali ke Riwayat Pembayaran
        </Link>
      ) : (
        <Link
          href="/order"
          className="inline-flex items-center text-xs sm:text-sm font-semibold text-[#4265D6] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4265D6] rounded px-1"
        >
          ← Kembali ke Daftar Pesanan
        </Link>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="border-b border-slate-200 p-6 bg-slate-50/60">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Pesanan Meja WARU
              </p>

              <h1 className="mt-1 text-2xl sm:text-3xl font-black text-[#293855]">
                Meja {order.tableNumber}
              </h1>

              <p className="mt-1 text-xs sm:text-sm text-slate-500 font-semibold">
                Pemesan: {order.customerName || "Pelanggan Umum"}
              </p>
            </div>

            <span className={`w-fit rounded-md border px-3.5 py-1 text-xs font-bold ${statusBadgeClass(order.status)}`}>
              Status: {statusLabel(order.status)}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <h2 className="text-base sm:text-lg font-bold text-[#293855] border-b border-slate-100 pb-3">
            Rincian Item Pesanan
          </h2>

          <div className="divide-y divide-slate-100 border-y border-slate-100">
            {order.items.map((item) => (
              <div
                key={item.menuId}
                className="flex items-center justify-between gap-4 py-3.5"
              >
                <div>
                  <p className="font-bold text-xs sm:text-sm text-[#293855]">
                    {item.name}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500 font-semibold">
                    {item.quantity} × {formatRupiah(item.price)}
                  </p>
                </div>

                <p className="font-black text-xs sm:text-sm text-[#293855]">
                  {formatRupiah(item.subtotal)}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 pt-5">
            <p className="text-base sm:text-lg font-bold text-[#293855]">
              Total Tagihan
            </p>

            <p className="text-xl sm:text-2xl font-black text-[#293855]">
              {formatRupiah(order.totalAmount)}
            </p>
          </div>

          {order.status !== "completed" && order.status !== "cancelled" && (
            <div className="pt-2">
              <Button
                variant="primary"
                onClick={handleOpenPaymentModal}
                className="w-full py-3.5 text-sm sm:text-base"
              >
                Bayar Pesanan Sekarang
              </Button>
            </div>
          )}

          {order.notes && (
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs sm:text-sm space-y-1">
              <p className="font-bold text-[#293855]">
                Catatan Khusus
              </p>

              <p className="text-slate-600">
                {order.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Pembayaran */}
      {isPaymentModalOpen && order && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#293855]/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#293855]">Pembayaran Pesanan</h2>
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4265D6]"
                aria-label="Tutup modal pembayaran"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {paymentError && (
              <div className="rounded-xl bg-red-50 p-3.5 text-xs sm:text-sm text-red-800 border border-red-200 font-semibold">
                {paymentError}
              </div>
            )}

            {activePayment && activePayment.method === "qris" ? (
              <div className="space-y-6 text-center py-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-[#293855]">Pindai QRIS untuk Bayar</h3>
                  <p className="text-xs text-slate-500 font-semibold">Total Tagihan: {formatRupiah(order.totalAmount)}</p>
                </div>
                
                <div className="relative mx-auto w-64 h-64 border border-slate-200 rounded-2xl shadow-xs overflow-hidden bg-white p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={activePayment.qrUrl} alt="QRIS Code" className="w-full h-full object-contain" />
                </div>
                
                <div className="space-y-3">
                  <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-left space-y-2">
                    <p className="text-[10px] sm:text-xs text-amber-800 font-bold">
                      💡 Info Sandbox Midtrans:
                    </p>
                    <p className="text-[10px] text-amber-700 font-semibold leading-relaxed">
                      Salin **QR Image URL** di bawah ini, buka simulator QRIS Midtrans, lalu tempelkan ke kolom input simulator untuk membayar.
                    </p>
                    
                    {activePayment.qrUrl && (
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500">QR Code Image URL:</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            readOnly
                            value={activePayment.qrUrl}
                            className="w-full text-[10px] border border-amber-300 rounded px-2 py-1 bg-white text-slate-600 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(activePayment.qrUrl || "");
                              alert("QR Image URL berhasil disalin!");
                            }}
                            className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold px-2 py-1 rounded transition"
                          >
                            Salin
                          </button>
                        </div>
                      </div>
                    )}

                    {activePayment.qrString && (
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500">QR String (Alternatif):</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            readOnly
                            value={activePayment.qrString}
                            className="w-full text-[10px] border border-amber-300 rounded px-2 py-1 bg-white text-slate-600 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(activePayment.qrString || "");
                              alert("QR String berhasil disalin!");
                            }}
                            className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold px-2 py-1 rounded transition"
                          >
                            Salin
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <a
                      href="https://simulator.sandbox.midtrans.com/v2/qris/payment"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-[11px] font-bold text-blue-600 hover:underline pt-1"
                    >
                      → Buka Simulator QRIS Midtrans Sandbox
                    </a>
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setActivePayment(null);
                      setIsPaymentModalOpen(false);
                    }}
                    className="w-full py-3"
                  >
                    Tutup / Batal
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#293855] mb-2">
                    Metode Pembayaran
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["cash", "qris"] as const).map((method) => {
                      const labels: Record<PaymentMethod, string> = {
                        cash: "Tunai (Cash)",
                        transfer: "Transfer Bank",
                        qris: "QRIS Direct",
                        card: "Kartu Debit/Kredit",
                      };
                      const active = paymentMethod === method;
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
                          className={`flex items-center justify-center rounded-xl border-2 py-2.5 px-3 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4265D6] min-h-[42px] ${
                            active
                              ? "border-[#4265D6] bg-[#4265D6] text-white shadow-xs"
                              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {labels[method]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#293855] mb-1.5">
                    Total Tagihan
                  </label>
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 font-mono text-base font-black text-[#293855]">
                    {formatRupiah(order.totalAmount)}
                  </div>
                </div>

                <Input
                  id="paidAmount"
                  label="Jumlah Bayar (Rp) *"
                  type="number"
                  required
                  min={0}
                  value={paidAmount || ""}
                  onChange={(e) => setPaidAmount(Number(e.target.value))}
                  placeholder="Masukkan nominal bayar..."
                />

                {paymentMethod === "cash" && paidAmount < order.totalAmount && (
                  <p className="text-xs text-red-600 font-semibold">
                    Jumlah bayar minimal {formatRupiah(order.totalAmount)}
                  </p>
                )}

                {paymentMethod === "cash" && paidAmount >= order.totalAmount && (
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-500">
                      Kembalian
                    </label>
                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 font-mono text-lg font-black text-[#204d28]">
                      {formatRupiah(changeAmount)}
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="notes" className="block text-xs sm:text-sm font-bold text-[#293855] mb-1.5">
                    Catatan Pembayaran (Opsional)
                  </label>
                  <textarea
                    id="notes"
                    rows={2}
                    value={paymentNotes}
                    onChange={(e) => setPaymentNotes(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm text-[#293855] focus-visible:outline-2 focus-visible:outline-[#4265D6] transition"
                    placeholder="Catatan pembayaran..."
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={submittingPayment}
                    onClick={() => setIsPaymentModalOpen(false)}
                    className="flex-1 min-h-[42px]"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={submittingPayment}
                    disabled={isSubmitDisabled}
                    className="flex-1 min-h-[42px]"
                  >
                    Konfirmasi Bayar
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Success Notification Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm rounded-xl bg-[#293855] text-white p-4 shadow-xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <svg className="h-5 w-5 shrink-0 text-[#C2E7C9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-xs sm:text-sm font-bold text-white">Pembayaran Berhasil</p>
            <p className="text-[11px] text-slate-300">Status pesanan telah diperbarui.</p>
          </div>
        </div>
      )}
    </div>
  );
}