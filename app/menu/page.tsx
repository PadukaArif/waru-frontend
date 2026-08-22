import MenuCard from "@/components/MenuCard";

const menus = [
    {
        id: 1,
        name: "Ayam Geprek",
        description: "Ayam crispy dengan sambal geprek.",
        price: 15000,
        available: true,
    },
    {
        id: 2,
        name: "Nasi Goreng",
        description: "Nasi goreng dengan telur dan sayuran.",
        price: 14000,
        available: true,
    },
    {
        id: 3,
        name: "Es Teh",
        description: "Teh manis dingin.",
        price: 5000,
        available: false,
    },
];

export default function MenuPage() {
    return (
        <main className="flex-1">
            <section className="mx-auto w-full max-w-7xl px-6 py-12">
                <div>
                    <h1 className="text-3xl font-bold">
                        Menu WARU
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Pilih makanan dan minuman yang kamu inginkan.
                    </p>
                </div>

                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {menus.map((menu) => (
                        <MenuCard
                            key={menu.id}
                            id={menu.id}
                            name={menu.name}
                            description={menu.description}
                            price={menu.price}
                            available={menu.available}
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}