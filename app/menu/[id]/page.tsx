import Link from "next/link";
import { getMenuById } from "@/services/menu";
import MenuImage from "@/components/MenuImage";

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
      <main className="flex-1 bg-gray-50/30">
        <section className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
          <Link
            href="/menu"
            className="mb-6 inline-flex items-center text-xs sm:text-sm font-semibold text-gray-600 hover:text-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded px-1"
          >
            ← Kembali ke Menu
          </Link>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xs">
            <div className="aspect-video overflow-hidden bg-gray-100 relative">
              <MenuImage
                src={menu.imageUrl}
                alt={menu.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">
                    {menu.category}
                  </span>

                  <h1 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
                    {menu.name}
                  </h1>
                </div>

                {menu.isRecommended && (
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                    Recommended
                  </span>
                )}
              </div>

              <p className="mt-5 text-sm sm:text-base text-gray-600 leading-relaxed">
                {menu.description}
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-between border-t border-gray-100 pt-6">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Harga</p>
                  <p className="mt-0.5 text-2xl sm:text-3xl font-extrabold text-gray-900">
                    Rp {menu.price.toLocaleString("id-ID")}
                  </p>
                </div>

                <div>
                  {menu.isAvailable ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 text-xs font-semibold text-emerald-700">
                      Tersedia
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-red-50 border border-red-200 px-3.5 py-1.5 text-xs font-semibold text-red-600">
                      Tidak tersedia
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  } catch (error) {
    console.error("Failed to fetch menu detail:", error);

    return (
      <main className="flex-1 bg-gray-50/30">
        <section className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-12">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 sm:p-12 text-center shadow-2xs">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              Menu tidak ditemukan
            </h1>

            <Link
              href="/menu"
              className="mt-4 inline-flex items-center text-xs sm:text-sm font-semibold text-black underline hover:opacity-80"
            >
              Kembali ke Menu
            </Link>
          </div>
        </section>
      </main>
    );
  }
}