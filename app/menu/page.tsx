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
            <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-8 sm:mt-10">
              {response.data.map((menu) => (
                <Link
                  key={menu._id}
                  href={`/menu/${menu._id}`}
                  className="group flex flex-col justify-between h-full overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-xs transition-all duration-300 hover:border-slate-300/80 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-primary"
                >
                  <div className="flex flex-col grow">
                    <div className="aspect-16/10 overflow-hidden bg-slate-100 relative">
                      <MenuImage
                        src={menu.imageUrl}
                        alt={menu.name}
                        className="h-full w-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-300"
                      />

                      {menu.isRecommended && (
                        <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-xs px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-amber-warm shadow-sm border border-amber-warm/25 select-none">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-warm animate-pulse" />
                          Recommended
                        </span>
                      )}
                    </div>

                    <div className="p-5 space-y-3 grow">
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="text-base sm:text-lg font-black text-navy group-hover:text-blue-primary transition-colors leading-tight">
                          {menu.name}
                        </h2>

                        <span className="shrink-0 text-[9px] font-extrabold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60 uppercase tracking-wider">
                          {menu.category}
                        </span>
                      </div>

                      <p className="line-clamp-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                        {menu.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Harga</p>
                        <p className="font-black text-navy text-base sm:text-[19px] tracking-tight">
                          Rp {menu.price.toLocaleString("id-ID")}
                        </p>
                      </div>

                      {menu.isAvailable ? (
                        <span className="inline-flex items-center rounded-md bg-emerald-50 border border-emerald-200/60 px-2.5 py-1.5 text-[11px] font-black text-green-dark uppercase tracking-wider">
                          Tersedia
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-md bg-red-50 border border-red-200/60 px-2.5 py-1.5 text-[11px] font-black text-red-700 uppercase tracking-wider">
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
                  <Button variant="outline" className="min-h-10">
                    ← Sebelumnya
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" disabled className="min-h-10 opacity-40">
                  ← Sebelumnya
                </Button>
              )}

              <span className="text-xs sm:text-sm font-semibold text-navy">
                Halaman {response.meta.page} dari {Math.max(response.meta.totalPages, 1)}
              </span>

              {response.meta.hasNext ? (
                <Link href={`/menu?page=${page + 1}`}>
                  <Button variant="outline" className="min-h-10">
                    Berikutnya →
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" disabled className="min-h-10 opacity-40">
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
          <h1 className="text-lg sm:text-xl font-bold text-navy">
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