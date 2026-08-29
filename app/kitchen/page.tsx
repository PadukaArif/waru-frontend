"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getKitchenOrders,
  updateKitchenOrderStatus,
  type KitchenItem,
  type KitchenStatus,
} from "@/services/kitchen";
import PageHeader from "@/components/UI/PageHeader";
import Badge from "@/components/UI/Badge";
import Button from "@/components/UI/Button";

function formatTime(isoString?: string): string {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

function getStatusBadgeVariant(status: KitchenStatus): "warning" | "info" | "success" | "danger" {
  switch (status) {
    case "pending":
      return "warning";
    case "in_progress":
      return "info";
    case "done":
      return "success";
    case "cancelled":
      return "danger";
    default:
      return "warning";
  }
}

function getStatusLabel(status: KitchenStatus): string {
  switch (status) {
    case "pending":
      return "PENDING";
    case "in_progress":
      return "SEDANG DIMASAK";
    case "done":
      return "SELESAI";
    case "cancelled":
      return "DIBATALKAN";
    default:
      return status;
  }
}

export default function KitchenDashboardPage() {
  const [items, setItems] = useState<KitchenItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | KitchenStatus>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setError("");
    try {
      const res = await getKitchenOrders(1, 100);
      setItems(res.data || []);
    } catch (err) {
      console.error("Failed to load kitchen orders:", err);
      setError("Gagal memuat antrean dapur.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();

    // Auto-refresh queue every 10 seconds
    const interval = setInterval(() => {
      fetchOrders();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchOrders]);

  async function handleStatusChange(id: string, newStatus: KitchenStatus) {
    setUpdatingId(id);
    try {
      const updatedItem = await updateKitchenOrderStatus(id, newStatus);
      setItems((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status: updatedItem.status } : item))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      const msg = err instanceof Error ? err.message : "Gagal mengubah status antrean.";
      alert(msg);
      setError(msg);
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredItems = items.filter((item) => {
    if (activeTab === "all") return true;
    return item.status === activeTab;
  });

  const pendingCount = items.filter((i) => i.status === "pending").length;
  const inProgressCount = items.filter((i) => i.status === "in_progress").length;
  const doneCount = items.filter((i) => i.status === "done").length;

  if (loading) {
    return (
      <div className="page-container py-6 sm:py-8 md:py-10 space-y-6">
        <PageHeader
          title="Antrean Dapur (Kitchen Queue)"
          description="Pantau dan perbarui status pesanan makanan real-time."
          badge="Role Kitchen"
        />
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-primary border-t-transparent" />
          <p className="text-xs sm:text-sm font-semibold text-slate-600">
            Memuat antrean dapur...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container py-6 sm:py-8 md:py-10 space-y-6 flex-1 flex flex-col">
      {/* Page Header */}
      <PageHeader
        title="Antrean Dapur (Kitchen Queue)"
        description="Pantau dan perbarui status pesanan makanan real-time."
        badge="Role Kitchen"
        action={
          <Button variant="outline" onClick={fetchOrders} className="min-h-9.5">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </Button>
        }
      />

      {/* Error Alert */}
      {error && (
        <div
          role="alert"
          className="rounded-xl bg-red-50 border border-red-200 p-4 text-xs sm:text-sm text-red-800 flex items-center justify-between gap-3 shadow-xs font-semibold"
        >
          <div className="flex items-center gap-2.5">
            <svg className="h-5 w-5 shrink-0 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
          <Button variant="outline" onClick={fetchOrders} className="min-h-8 text-xs py-1 px-3">
            Coba Lagi
          </Button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 select-none">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 cursor-pointer ${
            activeTab === "all"
              ? "bg-navy text-white shadow-2xs"
              : "text-slate-600 hover:text-navy hover:bg-slate-100"
          }`}
        >
          Semua ({items.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("pending")}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
            activeTab === "pending"
              ? "bg-amber-500 text-white shadow-2xs"
              : "text-slate-600 hover:text-navy hover:bg-slate-100"
          }`}
        >
          <span>Pending</span>
          {pendingCount > 0 && (
            <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("in_progress")}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
            activeTab === "in_progress"
              ? "bg-blue-primary text-white shadow-2xs"
              : "text-slate-600 hover:text-navy hover:bg-slate-100"
          }`}
        >
          <span>Sedang Dimasak</span>
          {inProgressCount > 0 && (
            <span className="bg-blue-100 text-blue-900 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
              {inProgressCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("done")}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
            activeTab === "done"
              ? "bg-emerald-600 text-white shadow-2xs"
              : "text-slate-600 hover:text-navy hover:bg-slate-100"
          }`}
        >
          <span>Selesai</span>
          {doneCount > 0 && (
            <span className="bg-emerald-100 text-emerald-900 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
              {doneCount}
            </span>
          )}
        </button>
      </div>

      {/* Orders Grid List */}
      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-base font-extrabold text-navy">Belum ada pesanan masuk.</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xs">
            Antrean pesanan makanan dari meja customer akan otomatis muncul di sini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredItems.map((item) => (
            <article
              key={item._id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition"
            >
              {/* Header: Table number & Status Badge */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Lokasi / Meja
                  </span>
                  <h3 className="text-lg font-black text-navy">
                    Meja #{item.tableNumber}
                  </h3>
                  {item.createdAt && (
                    <span className="text-[11px] text-slate-500 font-medium">
                      Pukul {formatTime(item.createdAt)}
                    </span>
                  )}
                </div>

                <Badge variant={getStatusBadgeVariant(item.status)} className="text-[11px] py-1 px-2.5">
                  {getStatusLabel(item.status)}
                </Badge>
              </div>

              {/* Items List */}
              <div className="space-y-2.5 flex-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Daftar Pesanan ({item.menuItems?.length || 0} item)
                </span>
                <ul className="space-y-2">
                  {item.menuItems?.map((mItem, idx) => (
                    <li
                      key={idx}
                      className="flex items-start justify-between gap-2 text-xs sm:text-sm bg-slate-50 p-2.5 rounded-xl border border-slate-200/60"
                    >
                      <div className="flex-1 min-w-0">
                        <span className="font-extrabold text-navy block leading-snug">
                          {mItem.name}
                        </span>
                        {mItem.notes && (
                          <span className="text-[11px] text-slate-500 italic block mt-0.5">
                            &quot;{mItem.notes}&quot;
                          </span>
                        )}
                      </div>
                      <span className="bg-navy text-white font-extrabold text-xs px-2 py-0.5 rounded-lg shrink-0">
                        x{mItem.quantity}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Customer Special Notes */}
                {item.notes && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                    <span className="font-extrabold uppercase tracking-wider block text-[10px] text-amber-700 mb-0.5">
                      Catatan Tambahan:
                    </span>
                    <p className="font-medium italic leading-relaxed">&quot;{item.notes}&quot;</p>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-100">
                {item.status === "pending" && (
                  <Button
                    type="button"
                    variant="primary"
                    disabled={updatingId === item._id}
                    onClick={() => handleStatusChange(item._id, "in_progress")}
                    className="w-full justify-center min-h-10 text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-600 border-amber-500"
                  >
                    {updatingId === item._id ? "Memproses..." : "🍳 Mulai Masak"}
                  </Button>
                )}

                {item.status === "in_progress" && (
                  <Button
                    type="button"
                    variant="primary"
                    disabled={updatingId === item._id}
                    onClick={() => handleStatusChange(item._id, "done")}
                    className="w-full justify-center min-h-10 text-xs sm:text-sm font-bold bg-blue-primary hover:bg-blue-600"
                  >
                    {updatingId === item._id ? "Memproses..." : "✅ Selesai Dimasak"}
                  </Button>
                )}

                {item.status === "done" && (
                  <div className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-xl border border-emerald-200">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Pesanan Selesai</span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
