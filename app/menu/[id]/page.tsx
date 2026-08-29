import Link from "next/link";
import { getMenuById } from "@/services/menu";
import MenuImage from "@/components/MenuImage";
import Button from "@/components/UI/Button";

interface MenuDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MenuDetailPage({
  params,
}: MenuDetailPageProps) {
  const { id } = await params;

  try {
    const menu = await getMenuById(id);

    return (
      <div className="page-container py-6 sm:py-8 md:py-10 max-w-4xl">
        <Link
          href="/menu"
          className="mb-6 inline-flex items-center text-xs sm:text-sm font-semibold text-[#4265D6] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4265D6] rounded px-1"
        >
          ← Kembali ke Katalog Menu
        </Link>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="aspect-16/9 sm:aspect-21/9 overflow-hidden bg-slate-100 relative">
            <MenuImage
              src={menu.imageUrl}
              alt={menu.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#293855] bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
                  {menu.category}
                </span>

                <h1 className="mt-3 text-2xl sm:text-4xl font-black tracking-tight text-[#293855]">
                  {menu.name}
                </h1>
              </div>

              {menu.isRecommended && (
                <span className="rounded-md border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-[#d99516]">
                  Recommended
                </span>
              )}
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {menu.description}
            </p>

            <div className="flex flex-wrap items-center justify-between border-t border-slate-100 pt-6 gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Harga Per Porsi</p>
                <p className="mt-0.5 text-2xl sm:text-3xl font-black text-[#293855]">
                  Rp {menu.price.toLocaleString("id-ID")}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {menu.isAvailable ? (
                  <span className="inline-flex items-center rounded-md bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 text-xs font-semibold text-[#204d28]">
                    Tersedia
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-md bg-red-50 border border-red-200 px-3.5 py-1.5 text-xs font-semibold text-red-700">
                    Tidak tersedia
                  </span>
                )}

                {menu.isAvailable && (
                  <Link href="/order/create">
                    <Button variant="primary" className="px-5 py-2.5">
                      + Pesan Sekarang
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch menu detail:", error);

    return (
      <div className="page-container py-12 max-w-4xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-xs space-y-4">
          <h1 className="text-lg sm:text-xl font-bold text-[#293855]">
            Menu Tidak Ditemukan
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Menu yang Anda cari mungkin telah dihapus atau tidak tersedia.
          </p>
          <Link href="/menu">
            <Button variant="outline">
              Kembali ke Katalog Menu
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}