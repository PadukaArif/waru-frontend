"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getJwtPayload } from "@/services/auth";
import Button from "@/components/UI/Button";
import Card from "@/components/UI/Card";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const payload = getJwtPayload();
    if (token && payload) {
      setIsLoggedIn(true);
      setUserRole(payload.role || null);
    }
  }, []);

  return (
    <div className="page-container py-8 sm:py-12 md:py-16 space-y-16 sm:space-y-24">
      {/* 1. Hero Section (First Viewport) */}
      <section className="flex flex-col items-start justify-center min-h-[calc(100vh-14rem)] py-6">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-md bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-semibold text-[#4265D6]">
            <span className="h-2 w-2 rounded-full bg-[#4265D6]"></span>
            WARU • Warung Analytics Resource Utility
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#293855] leading-[1.15]">
            Sistem POS & Analitik Operasional Warung Modern.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
            Kelola catalog menu, pesanan meja, riwayat transaksi pembayaran, hingga analitik bisnis berbasis AI dalam satu platform terpadu yang andal dan mudah digunakan.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            <Link href="/menu">
              <Button variant="primary" className="px-6 py-3.5 text-sm sm:text-base">
                Lihat Menu & Pesan
              </Button>
            </Link>

            {mounted && isLoggedIn ? (
              userRole === "boss" ? (
                <Link href="/admin">
                  <Button variant="outline" className="px-6 py-3.5 text-sm sm:text-base">
                    Portal Administrasi
                  </Button>
                </Link>
              ) : (
                <Link href="/order">
                  <Button variant="outline" className="px-6 py-3.5 text-sm sm:text-base">
                    Daftar Pesanan
                  </Button>
                </Link>
              )
            ) : (
              <Link href="/login">
                <Button variant="outline" className="px-6 py-3.5 text-sm sm:text-base">
                  Masuk ke Sistem
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Operational Highlights Band */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full border-t border-b border-slate-200/80 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#4265D6]">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#293855]">POS & Meja Direct</h3>
              <p className="text-xs text-slate-500">Pencatatan pesanan real-time</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-[#F2AC20]">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#293855]">Audit Pembayaran</h3>
              <p className="text-xs text-slate-500">Riwayat transaksi terverifikasi</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#293855]">Asisten Operasional AI</h3>
              <p className="text-xs text-slate-500">Analisis bisnis berbasis data</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Capability Grid Section */}
      <section className="space-y-8">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#4265D6]">
            Fitur Utama
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#293855]">
            Dirancang Untuk Efisiensi Operasional Warung
          </h2>
          <p className="text-sm text-slate-600 max-w-xl">
            Semua fungsi utama terintegrasi untuk mempercepat alur transaksi dari meja pelanggan hingga laporan pemilik warung.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#4265D6] flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="text-base font-bold text-[#293855]">Katalog Menu</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Kelola item makanan dan minuman lengkap dengan foto, deskripsi, stok, dan harga.
              </p>
            </div>
          </Card>

          <Card className="flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#4265D6] flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="text-base font-bold text-[#293855]">Pemesanan Meja</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Pencatatan nomor meja dan daftar pesanan pelanggan yang langsung dapat diproses kasir & dapur.
              </p>
            </div>
          </Card>

          <Card className="flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#4265D6] flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="text-base font-bold text-[#293855]">Status Pembayaran</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Pantau riwayat pembayaran, upload bukti transfer, dan status konfirmasi transaksi secara terpusat.
              </p>
            </div>
          </Card>

          <Card className="flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#4265D6] flex items-center justify-center font-bold">
                04
              </div>
              <h3 className="text-base font-bold text-[#293855]">AI Business Assistant</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Konsultasikan performa penjualan dan rekomendasi stok produk menggunakan asisten AI internal WARU.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* 3. High-Contrast Product Banner */}
      <section className="rounded-2xl bg-[#293855] text-white p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {mounted && isLoggedIn ? (
          <>
            <div className="space-y-2 max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Portal Operasional Warung Anda
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Kelola pesanan meja secara real-time, pantau riwayat pembayaran transaksi, dan analisis performa bisnis Anda.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link href="/order">
                <Button variant="amber" className="px-6 py-3">
                  Kelola Pesanan
                </Button>
              </Link>
              {userRole === "boss" ? (
                <Link href="/admin/assistant">
                  <Button variant="ghost" className="px-6 py-3">
                    Asisten AI
                  </Button>
                </Link>
              ) : (
                <Link href="/menu">
                  <Button variant="ghost" className="px-6 py-3">
                    Katalog Menu
                  </Button>
                </Link>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2 max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Siap Mengelola Warung Anda Lebih Efisien?
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Masuk ke akun WARU Anda untuk mengakses kasir, pesanan, dan laporan analisis usaha sekarang.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link href="/menu">
                <Button variant="amber" className="px-6 py-3">
                  Lihat Menu
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost" className="px-6 py-3">
                  Masuk Akun
                </Button>
              </Link>
            </div>
          </>
        )}
      </section>
    </div>
  );
}