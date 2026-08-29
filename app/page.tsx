import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex items-center justify-center bg-gray-50/30">
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full bg-black/5 border border-black/10 px-3 py-1 text-xs font-semibold text-gray-800 mb-6">
            WARU • Warung Analytics Resource Utility
          </span>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight sm:leading-none">
            Pesan makanan dengan mudah.
          </h1>

          <p className="mt-5 sm:mt-6 text-base sm:text-lg text-gray-600 leading-relaxed">
            Jelajahi menu WARU, lakukan pemesanan meja, dan pantau pesanan & transaksi pembayaranmu dalam satu platform terpadu.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              href="/menu"
              className="inline-flex items-center justify-center rounded-xl bg-black px-6 py-3.5 text-sm font-semibold text-white hover:bg-gray-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black min-h-[44px]"
            >
              Lihat Menu
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black min-h-[44px]"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}