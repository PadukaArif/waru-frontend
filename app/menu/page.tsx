import Link from "next/link";
import { getMenus } from "@/services/menu";
import MenuImage from "@/components/MenuImage";

interface MenuPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function MenuPage({
  searchParams,
}: MenuPageProps) {
  const params = await searchParams;

  const page = Math.max(
    1,
    Number.parseInt(params.page ?? "1", 10) || 1
  );

  try {
    const response = await getMenus(page, 9);

    return (
      <main className="flex-1 bg-gray-50/30">
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">Menu</h1>
              <p className="mt-1.5 text-xs sm:text-sm text-gray-600">
                Pilihan makanan dan minuman khas WARU.
              </p>
            </div>

            <Link
              href="/order/create"
              className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-gray-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black shadow-2xs text-center min-h-[44px]"
            >
              Buat Pesanan
            </Link>
          </div>

          {response.data.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 sm:p-12 text-center shadow-2xs">
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                Belum ada menu tersedia saat ini.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {response.data.map((menu) => (
                  <Link
                    key={menu._id}
                    href={`/menu/${menu._id}`}
                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xs transition hover:border-gray-300 hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-video overflow-hidden bg-gray-100 relative">
                        <MenuImage
                          src={menu.imageUrl}
                          alt={menu.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition duration-200"
                        />
                      </div>

                      <div className="p-5">
                        <div className="mb-2 flex items-start justify-between gap-3">
                          <h2 className="text-base sm:text-lg font-bold text-gray-900">
                            {menu.name}
                          </h2>

                          {menu.isRecommended && (
                            <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
                              Recommended
                            </span>
                          )}
                        </div>

                        <p className="mb-4 line-clamp-2 text-xs sm:text-sm text-gray-600">
                          {menu.description}
                        </p>

                        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">
                            Rp {menu.price.toLocaleString("id-ID")}
                          </p>

                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">
                            {menu.category}
                          </span>
                        </div>

                        {!menu.isAvailable && (
                          <div className="mt-3 rounded-lg bg-red-50 border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-600 w-fit">
                            Tidak tersedia
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-10 flex items-center justify-center gap-3 sm:gap-4">
                {response.meta.hasPrev ? (
                  <Link
                    href={`/menu?page=${page - 1}`}
                    className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black min-h-[40px] inline-flex items-center"
                  >
                    ← Sebelumnya
                  </Link>
                ) : (
                  <span className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs sm:text-sm font-medium text-gray-400 min-h-[40px] inline-flex items-center cursor-not-allowed">
                    ← Sebelumnya
                  </span>
                )}

                <span className="text-xs sm:text-sm font-medium text-gray-600">
                  Halaman {response.meta.page} dari{" "}
                  {Math.max(response.meta.totalPages, 1)}
                </span>

                {response.meta.hasNext ? (
                  <Link
                    href={`/menu?page=${page + 1}`}
                    className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black min-h-[40px] inline-flex items-center"
                  >
                    Berikutnya →
                  </Link>
                ) : (
                  <span className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs sm:text-sm font-medium text-gray-400 min-h-[40px] inline-flex items-center cursor-not-allowed">
                    Berikutnya →
                  </span>
                )}
              </div>
            </>
          )}
        </section>
      </main>
    );
  } catch (error) {
    console.error("Failed to fetch menu:", error);

    return (
      <main className="flex-1 bg-gray-50/30">
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-12">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 sm:p-12 text-center shadow-2xs">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              Gagal memuat menu
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-gray-600">
              Silakan coba lagi beberapa saat.
            </p>
          </div>
        </section>
      </main>
    );
  }
}