import Link from "next/link";

export default function Home() {
    return (
        <main className="flex flex-1 items-center">
            <section className="mx-auto w-full max-w-7xl px-6 py-20">
                <div className="max-w-2xl">
                    <p className="mb-4 text-sm font-medium">
                        WARU • Warung Analytics Resource Utility
                    </p>

                    <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                        Pesan makanan dengan mudah.
                    </h1>

                    <p className="mt-6 text-lg text-gray-600">
                        Jelajahi menu WARU, lakukan pemesanan, dan pantau
                        pesananmu dalam satu platform.
                    </p>

                    <div className="mt-8 flex gap-4">
                        <Link
                            href="/menu"
                            className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white"
                        >
                            Lihat Menu
                        </Link>

                        <Link
                            href="/login"
                            className="rounded-lg border px-5 py-3 text-sm font-medium"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}