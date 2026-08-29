import Link from "next/link";

export default function AdminIndexPage() {
  return (
    <main className="flex-1 bg-gray-50/30">
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8 border-b border-gray-200 pb-6">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">Admin Dashboard</h1>
            <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
              Role: Boss
            </span>
          </div>
          <p className="mt-1.5 text-xs sm:text-sm text-gray-600">
            Selamat datang di portal administrasi WARU. Silakan pilih modul pengelola di bawah ini.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs transition hover:border-gray-300 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Kelola Menu</h2>
              <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
                Tambah, perbarui, atau hapus item menu makanan dan minuman WARU.
              </p>
            </div>
            <div className="mt-6">
              <Link
                href="/admin/menu"
                className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-gray-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black min-h-[40px]"
              >
                Buka Admin Menu &rarr;
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs transition hover:border-gray-300 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Business Assistant</h2>
              <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
                Konsultasikan kondisi bisnis dan rekomendasi AI dari data operasional WARU.
              </p>
            </div>
            <div className="mt-6">
              <Link
                href="/admin/assistant"
                className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-gray-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black min-h-[40px]"
              >
                Tanya Assistant &rarr;
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-6 flex flex-col justify-between opacity-80">
            <div>
              <h2 className="text-lg font-bold text-gray-700">Analytics & Laporan</h2>
              <p className="mt-2 text-xs sm:text-sm text-gray-500 leading-relaxed">
                Fitur laporan penjualan dan analisis warung (segera hadir).
              </p>
            </div>
            <div className="mt-6">
              <span className="inline-block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Dalam Pengembangan
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
