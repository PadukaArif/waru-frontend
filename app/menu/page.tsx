import Link from "next/link";
import { getMenus } from "@/services/menu";
import MenuImage from "@/components/MenuImage";
import PageHeader from "@/components/UI/PageHeader";
import Button from "@/components/UI/Button";

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
      <div className="page-container py-6 sm:py-8 md:py-10">
        <PageHeader
          title="Katalog Menu WARU"
          description="Pilihan makanan dan minuman khas WARU yang siap dipesan."
          badge="Katalog Kasir & Outlet"
          action={
            <Link href="/order/create">
              <Button variant="primary">
                + Buat Pesanan
              </Button>
            </Link>
          }
        />

        {response.data.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-xs">
            <p className="text-xs sm:text-sm text-slate-600 font-semibold">
              Belum ada menu yang tersedia saat ini.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {response.data.map((menu) => (
                <Link
                  key={menu._id}
                  href={`/menu/${menu._id}`}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all duration-150 hover:border-slate-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4265D6]"
                >
                  <div>
                    <div className="aspect-4/3 overflow-hidden bg-slate-100 relative">
                      <MenuImage
                        src={menu.imageUrl}
                        alt={menu.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />

                      {menu.isRecommended && (
                        <span className="absolute top-3 right-3 rounded-md border border-amber-200 bg-amber-500 text-slate-900 px-2.5 py-0.5 text-xs font-bold shadow-xs">
                          Recommended
                        </span>
                      )}
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="text-base sm:text-lg font-extrabold text-[#293855] group-hover:text-[#4265D6] transition-colors leading-tight">
                          {menu.name}
                        </h2>

                        <span className="shrink-0 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {menu.category}
                        </span>
                      </div>

                      <p className="line-clamp-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {menu.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase">Harga</p>
                        <p className="font-black text-[#293855] text-base sm:text-lg">
                          Rp {menu.price.toLocaleString("id-ID")}
                        </p>
                      </div>

                      {menu.isAvailable ? (
                        <span className="rounded-md bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-[#204d28]">
                          Tersedia
                        </span>
                      ) : (
                        <span className="rounded-md bg-red-50 border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-700">
                          Habis
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4 border-t border-slate-200/80 pt-6">
              {response.meta.hasPrev ? (
                <Link href={`/menu?page=${page - 1}`}>
                  <Button variant="outline" className="min-h-[40px]">
                    ← Sebelumnya
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" disabled className="min-h-[40px] opacity-40">
                  ← Sebelumnya
                </Button>
              )}

              <span className="text-xs sm:text-sm font-semibold text-[#293855]">
                Halaman {response.meta.page} dari {Math.max(response.meta.totalPages, 1)}
              </span>

              {response.meta.hasNext ? (
                <Link href={`/menu?page=${page + 1}`}>
                  <Button variant="outline" className="min-h-[40px]">
                    Berikutnya →
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" disabled className="min-h-[40px] opacity-40">
                  Berikutnya →
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch menu:", error);

    return (
      <div className="page-container py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-xs space-y-3">
          <h1 className="text-lg sm:text-xl font-bold text-[#293855]">
            Gagal Memuat Katalog Menu
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Terjadi kendala koneksi ke server. Silakan coba muat ulang halaman.
          </p>
        </div>
      </div>
    );
  }
}