"use client";

import { useEffect, useState, useCallback } from "react";
import PageHeader from "@/components/UI/PageHeader";
import Button from "@/components/UI/Button";
import {
  getAnalyticsDashboard,
  type AnalyticsDashboardData,
  type AnalyticsPeriod,
} from "@/services/analytics";

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const PERIOD_LABELS: { key: AnalyticsPeriod; label: string }[] = [
  { key: "today", label: "Hari Ini" },
  { key: "week", label: "7 Hari Terakhir" },
  { key: "month", label: "Bulan Ini" },
  { key: "year", label: "Tahun Ini" },
];

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<AnalyticsPeriod>("month");
  const [data, setData] = useState<AnalyticsDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = useCallback(async (selectedPeriod: AnalyticsPeriod) => {
    setLoading(true);
    setError("");
    try {
      const res = await getAnalyticsDashboard(selectedPeriod);
      setData(res);
    } catch (err) {
      console.error("Failed to load analytics:", err);
      setError("Gagal memuat data analitik bisnis. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics(period);
  }, [period, fetchAnalytics]);

  const maxDailyRevenue = data?.dailySales?.length
    ? Math.max(...data.dailySales.map((d) => d.totalRevenue), 1)
    : 1;

  const totalPaymentCount = data?.paymentMethods?.length
    ? data.paymentMethods.reduce((acc, curr) => acc + curr.count, 0)
    : 0;

  return (
    <div className="page-container py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Page Header */}
      <PageHeader
        badge="LAPORAN BISNIS"
        title="Analitik & Performa Usaha"
        description="Pantau pendapatan, tren transaksi, menu terlaris, dan status operasional warung kamu secara real-time."
        action={
          <Button
            variant="outline"
            onClick={() => fetchAnalytics(period)}
            disabled={loading}
            className="text-xs sm:text-sm font-semibold"
          >
            🔄 Refresh Data
          </Button>
        }
      />

      {/* Filter Period Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/70">
          {PERIOD_LABELS.map((tab) => {
            const active = period === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setPeriod(tab.key)}
                className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                  active
                    ? "bg-white text-blue-primary shadow-xs"
                    : "text-slate-600 hover:text-navy hover:bg-slate-200/50"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {data?.dateRange && (
          <span className="text-xs text-slate-500 font-medium">
            Periode Data:{" "}
            <strong className="text-navy">
              {new Date(data.dateRange.from).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </strong>{" "}
            s/d{" "}
            <strong className="text-navy">
              {new Date(data.dateRange.to).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </strong>
          </span>
        )}
      </div>

      {/* Error Banner State */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <h4 className="text-sm font-bold text-red-900">Gagal Memuat Analitik</h4>
              <p className="text-xs sm:text-sm text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
          <Button variant="danger" onClick={() => fetchAnalytics(period)} className="shrink-0">
            Coba Lagi
          </Button>
        </div>
      )}

      {/* Loading Skeleton Grid */}
      {loading && !data && (
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-slate-200/70 rounded-2xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-72 bg-slate-200/70 rounded-2xl"></div>
            <div className="h-72 bg-slate-200/70 rounded-2xl"></div>
          </div>
        </div>
      )}

      {/* Main Dashboard Content */}
      {data && (
        <>
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Total Revenue */}
            <div className="rounded-2xl border border-amber-warm/40 bg-linear-to-br from-amber-warm/10 to-white p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-warm">
                  Total Pendapatan
                </span>
                <span className="p-2 rounded-xl bg-amber-warm/20 text-amber-warm font-black text-sm">
                  💰
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black text-navy tracking-tight">
                  {formatRupiah(data.sales.totalRevenue)}
                </div>
                <div className="mt-1 text-xs font-semibold text-slate-500">
                  Rata-rata order: {formatRupiah(data.sales.averageOrderValue)}
                </div>
              </div>
            </div>

            {/* Total Orders */}
            <div className="rounded-2xl border border-blue-100 bg-linear-to-br from-blue-50/60 to-white p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-primary">
                  Total Transaksi
                </span>
                <span className="p-2 rounded-xl bg-blue-100 text-blue-primary font-black text-sm">
                  📦
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black text-navy tracking-tight">
                  {data.sales.totalOrders}{" "}
                  <span className="text-xs font-normal text-slate-500">pesanan</span>
                </div>
                <div className="mt-1.5 flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                    ✓ {data.sales.completedOrders} Selesai
                  </span>
                  {data.sales.cancelledOrders > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold">
                      ✕ {data.sales.cancelledOrders} Batal
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Inventaris Warung Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Inventaris Warung
                </span>
                <span className="p-2 rounded-xl bg-slate-100 text-navy font-black text-sm">
                  📋
                </span>
              </div>
              <div className="mt-3 space-y-1.5">
                <div className="text-2xl sm:text-3xl font-black text-navy tracking-tight">
                  {data.inventory.totalItems}{" "}
                  <span className="text-xs font-normal text-slate-500">item barang</span>
                </div>

                {data.inventory.totalItems === 0 ? (
                  <div className="space-y-0.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold">
                      Belum ada data inventory
                    </span>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Tambahkan barang untuk mulai memantau stok
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
                      {data.inventory.safeStockCount > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                          ✓ {data.inventory.safeStockCount} aman
                        </span>
                      )}
                      {data.inventory.lowStockCount > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
                          ⚠️ {data.inventory.lowStockCount} menipis
                        </span>
                      )}
                      {data.inventory.outOfStockCount > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">
                          ✕ {data.inventory.outOfStockCount} habis
                        </span>
                      )}
                    </div>
                    {data.inventory.totalInventoryValue > 0 && (
                      <p className="text-[11px] text-slate-500 font-medium">
                        Nilai stok: {formatRupiah(data.inventory.totalInventoryValue)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Rating / Satisfaction */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Ulasan Pelanggan
                </span>
                <span className="p-2 rounded-xl bg-slate-100 text-amber-500 font-black text-sm">
                  ⭐
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black text-navy tracking-tight flex items-center gap-1.5">
                  {data.reviews.averageRating.toFixed(1)}{" "}
                  <span className="text-sm font-normal text-slate-400">/ 5.0</span>
                </div>
                <div className="mt-1 text-xs text-slate-500 font-medium">
                  Berdasarkan {data.reviews.totalReviews} ulasan pelanggan
                </div>
              </div>
            </div>
          </div>

          {/* Main Sales Trend & Payment Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Daily Sales Chart Breakdown */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-navy">
                    Tren Penjualan Harian
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pendapatan dan jumlah pesanan per hari pada periode ini.
                  </p>
                </div>
              </div>

              {data.dailySales.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs sm:text-sm font-medium">
                  Belum ada catatan penjualan harian pada periode ini.
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  {data.dailySales.map((day) => {
                    const percent = Math.round((day.totalRevenue / maxDailyRevenue) * 100);
                    return (
                      <div key={day.date} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-navy">
                            {new Date(day.date).toLocaleDateString("id-ID", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500 font-normal">
                              {day.totalOrders} order
                            </span>
                            <span className="text-navy font-bold">
                              {formatRupiah(day.totalRevenue)}
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
                          <div
                            className="bg-blue-primary h-full rounded-full transition-all duration-300"
                            style={{ width: `${Math.max(percent, 4)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Payment Method Distribution */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base sm:text-lg font-extrabold text-navy">
                  Metode Pembayaran
                </h3>
                <p className="text-xs text-slate-500">
                  Proporsi transaksi Tunai (Cash) vs QRIS Digital.
                </p>
              </div>

              {data.paymentMethods.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs sm:text-sm font-medium">
                  Belum ada data pembayaran.
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  {data.paymentMethods.map((pm) => {
                    const percentage =
                      totalPaymentCount > 0 ? Math.round((pm.count / totalPaymentCount) * 100) : 0;
                    const isCash = pm.method.toLowerCase() === "cash";
                    return (
                      <div key={pm.method} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold text-navy">
                          <span className="capitalize flex items-center gap-1.5">
                            {isCash ? "💵 Tunai (Cash)" : "📱 QRIS / Digital"}
                          </span>
                          <span>
                            {pm.count}x ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isCash ? "bg-amber-warm" : "bg-blue-primary"
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-[11px] text-slate-500 text-right font-medium">
                          Total: {formatRupiah(pm.total)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Product Performance Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Selling Menu Items */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base sm:text-lg font-extrabold text-navy">
                  🏆 Menu Terlaris (Top Ranking)
                </h3>
                <p className="text-xs text-slate-500">
                  Daftar menu dengan penjualan tertinggi berdasarkan jumlah porsi teruji.
                </p>
              </div>

              {data.topMenuItems.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs sm:text-sm font-medium">
                  Belum ada data menu terlaris pada periode ini.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-200/80 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                        <th className="py-2.5 px-3">No</th>
                        <th className="py-2.5 px-3">Nama Menu</th>
                        <th className="py-2.5 px-3 text-center">Terjual</th>
                        <th className="py-2.5 px-3 text-right">Total omzet</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.topMenuItems.map((item, idx) => (
                        <tr key={item.name} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3 font-bold text-slate-400">#{idx + 1}</td>
                          <td className="py-3 px-3 font-extrabold text-navy">{item.name}</td>
                          <td className="py-3 px-3 text-center font-bold text-blue-primary">
                            {item.totalSold} porsi
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-navy">
                            {formatRupiah(item.totalRevenue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Rating Distribution Breakdown */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base sm:text-lg font-extrabold text-navy">
                  Sebaran Rating Ulasan
                </h3>
                <p className="text-xs text-slate-500">
                  Distribusi nilai kepuasan pelanggan terhadap layanan warung.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = data.reviews.ratingDistribution[String(star)] || 0;
                  const percent =
                    data.reviews.totalReviews > 0
                      ? Math.round((count / data.reviews.totalReviews) * 100)
                      : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs font-semibold">
                      <span className="w-12 text-slate-600 font-bold shrink-0">{star} Bintang</span>
                      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-amber-warm h-full rounded-full transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <span className="w-10 text-right text-slate-400 font-medium shrink-0">
                        {count} ({percent}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
