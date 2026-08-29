import Link from "next/link";

export default function AdminIndexPage() {
  return (
    <main className="min-h-[80vh] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 border-b pb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
              Role: Boss
            </span>
          </div>
          <p className="mt-2 text-gray-600">
            Selamat datang di portal administrasi WARU. Silakan pilih menu di bawah ini.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border p-6 hover:shadow-sm transition bg-white flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold">Kelola Menu</h2>
              <p className="mt-2 text-sm text-gray-600">
                Tambah, perbarui, atau hapus item menu makanan dan minuman WARU.
              </p>
            </div>
            <div className="mt-6">
              <Link
                href="/admin/menu"
                className="inline-block rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition"
              >
                Buka Admin Menu &rarr;
              </Link>
            </div>
          </div>

          <div className="rounded-xl border p-6 hover:shadow-sm transition bg-white flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold">Business Assistant</h2>
              <p className="mt-2 text-sm text-gray-600">
                Konsultasikan kondisi bisnis dan rekomendasi AI dari data operasional WARU.
              </p>
            </div>
            <div className="mt-6">
              <Link
                href="/admin/assistant"
                className="inline-block rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition"
              >
                Tanya Assistant &rarr;
              </Link>
            </div>
          </div>

          <div className="rounded-xl border p-6 bg-gray-50 opacity-80 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Analytics & Laporan</h2>
              <p className="mt-2 text-sm text-gray-500">
                Fitur laporan penjualan dan analisis warung (segera hadir).
              </p>
            </div>
            <div className="mt-6">
              <span className="inline-block text-xs font-medium text-gray-400">
                Dalam Pengembangan
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
