"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register, getJwtPayload } from "@/services/auth";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const payload = getJwtPayload();
    if (payload) {
      router.replace("/menu");
    }
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await register({
        name,
        email,
        password,
      });

      router.push("/menu");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Registrasi gagal. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page-container flex min-h-[calc(100vh-10rem)] items-center justify-center py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs text-[#293855]">
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <span className="inline-flex items-center rounded-md bg-blue-50 border border-blue-100 px-2.5 py-0.5 text-xs font-bold text-[#4265D6] uppercase tracking-wider mb-3">
            WARU POS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#293855]">
            Buat Akun Baru
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
            Daftarkan warung kamu untuk mulai bertransaksi & mengelola menu.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <Input
            id="name"
            type="text"
            label="Nama Lengkap"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan nama lengkap kamu"
            autoComplete="name"
            required
          />

          <Input
            id="email"
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            autoComplete="email"
            required
          />

          <Input
            id="password"
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 6 karakter"
            autoComplete="new-password"
            required
          />

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs sm:text-sm text-red-700 flex items-start gap-2.5"
            >
              <svg className="h-5 w-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            loading={loading}
            variant="primary"
            className="w-full mt-2"
          >
            {loading ? "Mendaftarkan Akun..." : "Daftar Sekarang"}
          </Button>

          <div className="border-t border-slate-100 pt-4 text-center text-xs sm:text-sm text-slate-600">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-bold text-[#4265D6] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4265D6] rounded px-1"
            >
              Masuk di sini
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
