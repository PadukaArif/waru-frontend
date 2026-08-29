import Link from "next/link";
import PageHeader from "@/components/UI/PageHeader";
import Button from "@/components/UI/Button";
import Card from "@/components/UI/Card";

export default function AdminIndexPage() {
  return (
    <div className="page-container py-6 sm:py-8 md:py-10 space-y-8">
      <PageHeader
        title="Portal Administrasi WARU"
        description="Pusat kontrol katalog produk, asisten bisnis AI, dan pemantauan operasional warung."
        badge="Role: Boss"
        action={
          <span className="inline-flex items-center gap-1.5 rounded-md bg-[#293855] text-white px-3 py-1 text-xs font-bold shadow-xs">
            <span className="h-2 w-2 rounded-full bg-[#C2E7C9]" />
            Akses Pemilik Terverifikasi
          </span>
        }
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Module 1: Kelola Menu */}
        <Card className="flex flex-col justify-between hover:border-slate-300 transition-all duration-150 p-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#4265D6] bg-blue-50 px-2.5 py-1 rounded border border-blue-100">
                Katalog & Stok
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Aktif
              </span>
            </div>

            <h2 className="text-lg font-black text-[#293855]">Kelola Katalog Menu</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Tambah item hidangan baru, perbarui harga, ubah ketersediaan stok, dan atur rekomendasi menu.
            </p>
          </div>

          <div>
            <Link href="/admin/menu">
              <Button variant="primary" className="w-full justify-between">
                <span>Buka Admin Menu</span>
                <span>→</span>
              </Button>
            </Link>
          </div>
        </Card>

        {/* Module 2: AI Business Assistant */}
        <Card className="flex flex-col justify-between hover:border-slate-300 transition-all duration-150 p-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#d99516] bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                WARU AI Assistant
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Aktif
              </span>
            </div>

            <h2 className="text-lg font-black text-[#293855]">AI Business Assistant</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Konsultasikan tren penjualan, analisis menu terlaris, dan strategi operasional dengan asisten AI WARU.
            </p>
          </div>

          <div>
            <Link href="/admin/assistant">
              <Button variant="primary" className="w-full justify-between">
                <span>Konsultasi Asisten AI</span>
                <span>→</span>
              </Button>
            </Link>
          </div>
        </Card>

        {/* Module 3: Analytics (Disabled / Segera Hadir) */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 flex flex-col justify-between space-y-6 opacity-75">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-200/60 px-2.5 py-1 rounded border border-slate-300/40">
                Laporan & Grafik
              </span>
              <span className="text-xs font-semibold text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded border border-slate-300/40">
                Segera Hadir
              </span>
            </div>

            <h2 className="text-lg font-bold text-slate-700">Analitik & Laporan Omzet</h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Fitur analisis omzet harian, grafik keuntungan, dan laporan keuangan komprehensif sedang dikembangkan.
            </p>
          </div>

          <div className="pt-2">
            <span className="inline-flex w-full items-center justify-center rounded-xl bg-slate-200/80 px-4 py-2.5 text-xs font-semibold text-slate-500 min-h-[44px] cursor-not-allowed select-none">
              Modul Dalam Pengujian
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

