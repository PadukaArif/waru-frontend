import Link from "next/link";
import { getMenus } from "@/services/menu";

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
      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-6 py-12">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Menu</h1>
              <p className="mt-2 text-gray-600">
                Pilihan makanan dan minuman Waru.
              </p>
            </div>

            <Link
              href="/order/create"
              className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition shadow-sm text-center"
            >
              Buat Pesanan
            </Link>
          </div>

          {response.data.length === 0 ? (
            <div className="rounded-xl border p-8 text-center">
              <p className="text-gray-500">
                Belum ada menu tersedia.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {response.data.map((menu) => (
                  <Link
                    key={menu._id}
                    href={`/menu/${menu._id}`}
                    className="overflow-hidden rounded-xl border transition hover:shadow-md"
                  >
                    <div className="aspect-video overflow-hidden bg-gray-100">
                      <img
                        src={menu.imageUrl}
                        alt={menu.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="p-5">
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <h2 className="text-xl font-semibold">
                          {menu.name}
                        </h2>

                        {menu.isRecommended && (
                          <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium">
                            Recommended
                          </span>
                        )}
                      </div>

                      <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                        {menu.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <p className="font-semibold">
                          Rp{" "}
                          {menu.price.toLocaleString("id-ID")}
                        </p>

                        <span className="text-sm text-gray-500">
                          {menu.category}
                        </span>
                      </div>

                      {!menu.isAvailable && (
                        <p className="mt-3 text-sm font-medium text-red-500">
                          Tidak tersedia
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-10 flex items-center justify-center gap-4">
                {response.meta.hasPrev ? (
                  <Link
                    href={`/menu?page=${page - 1}`}
                    className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                  >
                    ← Sebelumnya
                  </Link>
                ) : (
                  <span className="rounded-lg border px-4 py-2 text-sm text-gray-400">
                    ← Sebelumnya
                  </span>
                )}

                <span className="text-sm text-gray-600">
                  Halaman {response.meta.page} dari{" "}
                  {Math.max(response.meta.totalPages, 1)}
                </span>

                {response.meta.hasNext ? (
                  <Link
                    href={`/menu?page=${page + 1}`}
                    className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                  >
                    Berikutnya →
                  </Link>
                ) : (
                  <span className="rounded-lg border px-4 py-2 text-sm text-gray-400">
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
      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-6 py-12">
          <div className="rounded-xl border p-8 text-center">
            <h1 className="text-xl font-semibold">
              Gagal memuat menu
            </h1>

            <p className="mt-2 text-gray-500">
              Silakan coba lagi beberapa saat.
            </p>
          </div>
        </section>
      </main>
    );
  }
}