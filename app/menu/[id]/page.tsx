import Link from "next/link";

type MenuDetailPageProps = {
    params: Promise<{
        id: string;
    }>;
};

const menus = [
    {
        id: "1",
        name: "Ayam Geprek",
        description: "Ayam crispy dengan sambal geprek.",
        price: 15000,
        available: true,
    },
    {
        id: "2",
        name: "Nasi Goreng",
        description: "Nasi goreng dengan telur dan sayuran.",
        price: 14000,
        available: true,
    },
    {
        id: "3",
        name: "Es Teh",
        description: "Teh manis dingin.",
        price: 5000,
        available: false,
    },
];

export default async function MenuDetailPage({
    params,
}: MenuDetailPageProps) {
    const { id } = await params;

    const menu = menus.find((item) => item.id === id);

    if (!menu) {
        return (
            <main className="flex flex-1 items-center justify-center">
                <p>Menu tidak ditemukan.</p>
            </main>
        );
    }

    return (
        <main className="flex-1">
            <section className="mx-auto w-full max-w-4xl px-6 py-12">
                <div className="rounded-xl border p-6">
                    <h1 className="text-3xl font-bold">
                        {menu.name}
                    </h1>

                    <p className="mt-4 text-gray-600">
                        {menu.description}
                    </p>

                    <p className="mt-6 text-xl font-semibold">
                        Rp {menu.price.toLocaleString("id-ID")}
                    </p>

                    <div className="mt-6">
                        {menu.available ? (
                            <button
                                type="button"
                                className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white"
                            >
                                Add to Cart
                            </button>
                        ) : (
                            <p className="text-sm font-medium text-gray-500">
                                Menu sedang tidak tersedia.
                            </p>
                        )}
                    </div>
                </div>
            </section>
            <Link
                href="/menu"
                className="mb-6 inline-flex items-center rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
            >
                ← Kembali ke Menu
            </Link>
        </main>
    );
}