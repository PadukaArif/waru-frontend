import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthGuard from "@/components/AuthGuard";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "WARU — Warung Analytics Resource Utility",
    description: "WARU - Multi-Outlet & POS Management System",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="id"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col bg-[#f8fafc] text-navy">
                <Navbar />
                <AuthGuard>
                    <main className="flex-1 w-full">
                        {children}
                    </main>
                </AuthGuard>
                <Footer />
            </body>
        </html>
    );
}