import Link from "next/link";
import Button from "@/components/UI/Button";

export default function Home() {
  return (
    <section className="page-container py-12 sm:py-16 md:py-20 flex flex-col justify-center min-h-[calc(100vh-8rem)]">
      <div className="max-w-2xl space-y-6">
        <span className="inline-flex items-center rounded-md bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-semibold text-[#4265D6]">
          WARU • Warung Analytics Resource Utility
        </span>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#293855] leading-tight">
          Sistem POS & Analitik Warung Terpadu.
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Jelajahi menu WARU, lakukan pemesanan meja, dan pantau pesanan & transaksi pembayaranmu dalam satu platform terpadu.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
          <Link href="/menu">
            <Button variant="primary" className="px-6 py-3">
              Lihat Menu
            </Button>
          </Link>

          <Link href="/login">
            <Button variant="outline" className="px-6 py-3">
              Login Akun
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}