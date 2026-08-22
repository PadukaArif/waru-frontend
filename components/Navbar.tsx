import Link from "next/link";

export default function Navbar() {
    return (
        <header className="border-b">
            <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
                <Link href="/" className="text-xl font-bold">
                    WARU
                </Link>

                <div className="flex items-center gap-6">
                    <Link href="/" className="text-sm hover:opacity-70">
                        Home
                    </Link>

                    <Link href="/menu" className="text-sm hover:opacity-70">
                        Menu
                    </Link>

                    <Link href="/login" className="text-sm hover:opacity-70">
                        Login
                    </Link>
                </div>
            </nav>
        </header>
    );
}