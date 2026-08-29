import Link from "next/link";
import PageHeader from "@/components/UI/PageHeader";
import Button from "@/components/UI/Button";
import Card from "@/components/UI/Card";

export default function AdminIndexPage() {
  return (
    <div className="page-container py-6 sm:py-8 md:py-10 space-y-8">
      <PageHeader
        title="Portal Administrasi WARU"
        description="Pusat kontrol katalog produk, inventaris stok, asisten bisnis AI, dan pemantauan operasional warung."
        badge="Role: Boss"
        action={
          <span className="inline-flex items-center gap-1.5 rounded-md bg-navy text-white px-3 py-1 text-xs font-bold shadow-xs">
            <span className="h-2 w-2 rounded-full bg-green-soft" />
            Akses Pemilik Terverifikasi
          </span>
        }
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Module 1: Kelola Menu */}
        <Card className="flex flex-col justify-between hover:border-slate-300 transition-all duration-150 p-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-primary bg-blue-50 px-2.5 py-1 rounded border border-blue-100">
                Katalog & Produk
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Aktif
              </span>
            </div>

            <h2 className="text-lg font-black text-navy">Kelola Katalog Menu</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Tambah item hidangan baru, atur resep bahan baku, perbarui harga, dan kelola ketersediaan menu.
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

        {/* Module 2: Kelola Inventaris */}
        <Card className="flex flex-col justify-between hover:border-slate-300 transition-all duration-150 p-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-primary bg-blue-50 px-2.5 py-1 rounded border border-blue-100">
                Bahan & Stok
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Aktif
              </span>
            </div>

            <h2 className="text-lg font-black text-navy">Manajemen Inventaris</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Pantau stok bahan baku operasional, batas minimum stok, harga modal, dan lakukan restock barang.
            </p>
          </div>

          <div>
            <Link href="/admin/inventory">
              <Button variant="primary" className="w-full justify-between">
                <span>Buka Inventaris</span>
                <span>→</span>
              </Button>
            </Link>
          </div>
        </Card>

        {/* Module 3: AI Business Assistant */}
        <Card className="flex flex-col justify-between hover:border-slate-300 transition-all duration-150 p-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-hover bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                WARU AI Assistant
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Aktif
              </span>
            </div>

            <h2 className="text-lg font-black text-navy">AI Business Assistant</h2>
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

        {/* Module 4: Analytics & Laporan Omzet */}
        <Card className="flex flex-col justify-between hover:border-slate-300 transition-all duration-150 p-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-primary bg-blue-50 px-2.5 py-1 rounded border border-blue-100">
                Laporan & Grafik
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Aktif
              </span>
            </div>

            <h2 className="text-lg font-black text-navy">Analitik & Laporan Omzet</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Pantau total pendapatan, tren penjualan harian, statistik metode pembayaran, dan status inventaris warung.
            </p>
          </div>

          <div>
            <Link href="/admin/analytics">
              <Button variant="primary" className="w-full justify-between">
                <span>Buka Dashboard Analitik</span>
                <span>→</span>
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
