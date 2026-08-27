"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getUserRole } from "@/services/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setAuthorized(false);
      setLoading(false);
      router.replace("/login");
      return;
    }

    const role = getUserRole();
    if (role !== "boss") {
      setAuthorized(false);
      setLoading(false);
      router.replace("/menu");
      return;
    }

    setAuthorized(true);
    setLoading(false);
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent"></div>
          <p className="mt-4 text-sm text-gray-500">Memeriksa hak akses admin...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}
