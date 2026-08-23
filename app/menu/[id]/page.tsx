import Link from "next/link";
import { getMenuById } from "@/services/menu";

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
      <main className="flex-1">
        <section className="mx-auto w-full max-w-4xl px-6 py-12">
          <Link
            href="/menu"
            className="mb-6 inline-block text-sm text-gray-600 hover:text-black"
          >
            ← Kembali ke Menu
          </Link>

          <div className="overflow-hidden rounded-xl border">
            <div className="aspect-video overflow-hidden bg-gray-100">
              <img
                src={menu.imageUrl}
                alt={menu.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="mb-2 text-sm text-gray-500">
                    {menu.category}
                  </p>

                  <h1 className="text-3xl font-bold">
                    {menu.name}
                  </h1>
                </div>

                {menu.isRecommended && (
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium">
                    Recommended
                  </span>
                )}
              </div>

              <p className="mt-5 text-gray-600">
                {menu.description}
              </p>

              <p className="mt-6 text-2xl font-bold">
                Rp {menu.price.toLocaleString("id-ID")}
              </p>

              <div className="mt-4">
                {menu.isAvailable ? (
                  <span className="font-medium text-green-600">
                    Tersedia
                  </span>
                ) : (
                  <span className="font-medium text-red-500">
                    Tidak tersedia
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  } catch (error) {
    console.error("Failed to fetch menu detail:", error);

    return (
      <main className="flex-1">
        <section className="mx-auto w-full max-w-4xl px-6 py-12">
          <div className="rounded-xl border p-8 text-center">
            <h1 className="text-xl font-semibold">
              Menu tidak ditemukan
            </h1>

            <Link
              href="/menu"
              className="mt-4 inline-block text-sm underline"
            >
              Kembali ke Menu
            </Link>
          </div>
        </section>
      </main>
    );
  }
}