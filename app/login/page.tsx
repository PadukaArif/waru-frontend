"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/services/auth";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login({
        email,
        password,
      });

      router.push("/menu");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Login gagal. Silakan coba lagi."
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
            Login
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-gray-600">
            Masuk ke akun WARU kamu untuk mengelola pesanan & analitik.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
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
            placeholder="Masukkan password"
            autoComplete="current-password"
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
            {loading ? "Memproses..." : "Login"}
          </Button>

          <p className="text-center text-xs sm:text-sm text-gray-600 pt-2">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-semibold text-black hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded"
            >
              Daftar di sini
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}