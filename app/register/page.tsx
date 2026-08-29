"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/services/auth";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: {
    preventDefault: () => void;
  }): Promise<void> {
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
    <main className="flex min-h-[calc(100vh-65px)] items-center justify-center px-4 sm:px-6 py-10 bg-gray-50/30">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-2xs">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Register
          </h1>

          <p className="mt-1.5 text-xs sm:text-sm text-gray-600">
            Buat akun WARU baru untuk mulai bertransaksi.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <Input
            id="name"
            type="text"
            label="Nama Lengkap"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama kamu"
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
              className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs sm:text-sm text-red-800 flex items-center justify-between"
            >
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-2"
          >
            {loading ? "Mendaftarkan..." : "Register"}
          </Button>

          <p className="text-center text-xs sm:text-sm text-gray-600 pt-2">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-semibold text-black hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded"
            >
              Masuk di sini
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}