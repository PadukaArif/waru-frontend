"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMenus, type Menu } from "@/services/menu";
import { createOrder } from "@/services/order";

interface SelectedItem {
  menuId: string;
  name: string;
  price: number;
  quantity: number;
}

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export default function CreateOrderPage() {
  const router = useRouter();

  const [menus, setMenus] = useState<Menu[]>([]);
  const [loadingMenus, setLoadingMenus] = useState(true);
  const [menusError, setMenusError] = useState("");

  const [tableNumber, setTableNumber] = useState<number | "">("");
  const [customerName, setCustomerName] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    async function loadMenus() {
      try {
        setLoadingMenus(true);
        // Fetch up to 100 menus to get all items
        const response = await getMenus(1, 100);
        // Filter only available menus
        setMenus(response.data.filter((m) => m.isAvailable));
      } catch (err) {
        console.error("Failed to load menus:", err);
        setMenusError(err instanceof Error ? err.message : "Gagal memuat menu");
      } finally {
        setLoadingMenus(false);
      }
    }
    loadMenus();
  }, []);

  const handleAddItem = (menu: Menu) => {
    setSelectedItems((prev) => {
      const existing = prev.find((item) => item.menuId === menu._id);
      if (existing) {
        return prev.map((item) =>
          item.menuId === menu._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          menuId: menu._id,
          name: menu.name,
          price: menu.price,
          quantity: 1,
        },
      ];
    });
  };

  const handleUpdateQuantity = (menuId: string, delta: number) => {
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.menuId === menuId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (menuId: string) => {
    setSelectedItems((prev) => prev.filter((item) => item.menuId !== menuId));
  };

  const totalAmount = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const isFormValid =
    typeof tableNumber === "number" &&
    tableNumber >= 1 &&
    selectedItems.length > 0 &&
    selectedItems.every((item) => item.quantity >= 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      setSubmitting(true);
      setSubmitError("");

      const payload = {
        tableNumber: Number(tableNumber),
        customerName: customerName.trim() || undefined,
        notes: notes.trim() || undefined,
        items: selectedItems.map((item) => ({
          menuId: item.menuId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const result = await createOrder(payload);

      if (result && result.insertedId) {
        router.push(`/order/${result.insertedId}`);
      } else {
        router.push("/order");
      }
    } catch (err) {
      console.error("Failed to create order:", err);
      setSubmitError(
        err instanceof Error ? err.message : "Gagal membuat pesanan"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex-1 bg-gray-50/30">
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8 border-b border-gray-200 pb-6">
          <Link
            href="/order"
            className="inline-flex items-center text-xs sm:text-sm font-semibold text-gray-600 hover:text-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded px-1"
          >
            ← Kembali ke Orders
          </Link>
          <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">Buat Pesanan</h1>
          <p className="mt-1.5 text-xs sm:text-sm text-gray-600">Pilih menu dan masukkan nomor meja untuk membuat pesanan baru.</p>
        </div>

        {submitError && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-xs sm:text-sm text-red-800 border border-red-200 shadow-2xs">
            {submitError}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Menu Selection (Left) */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xs">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5">Pilih Menu</h2>

              {loadingMenus ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-24 animate-pulse rounded-xl bg-gray-100" />
                  ))}
                </div>
              ) : menusError ? (
                <p className="text-center text-xs sm:text-sm text-red-500 py-6 font-medium">{menusError}</p>
              ) : menus.length === 0 ? (
                <p className="text-center text-xs sm:text-sm text-gray-500 py-6 font-medium">Tidak ada menu tersedia saat ini.</p>
              ) : (
                <div className="grid gap-3.5 sm:grid-cols-2">
                  {menus.map((menu) => {
                    const cartItem = selectedItems.find((item) => item.menuId === menu._id);
                    return (
                      <div
                        key={menu._id}
                        onClick={() => handleAddItem(menu)}
                        className={`group relative flex gap-3.5 overflow-hidden rounded-xl border p-3 transition hover:border-gray-300 hover:shadow-2xs cursor-pointer select-none ${
                          cartItem ? "border-black bg-gray-50/70" : "border-gray-200 bg-white"
                        }`}
                      >
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          <img
                            src={menu.imageUrl}
                            alt={menu.name}
                            className="h-full w-full object-cover group-hover:scale-105 transition"
                          />
                        </div>
                        <div className="flex flex-col justify-between py-0.5 min-w-0 flex-1">
                          <div>
                            <h3 className="font-bold text-xs sm:text-sm text-gray-900 truncate">{menu.name}</h3>
                            <p className="text-[11px] text-gray-500 mt-0.5 font-medium">{menu.category}</p>
                          </div>
                          <p className="font-bold text-xs sm:text-sm text-gray-900">{formatRupiah(menu.price)}</p>
                        </div>
                        {cartItem && (
                          <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[11px] font-bold text-white shadow-xs">
                            {cartItem.quantity}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Form and Cart Summary (Right) */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xs space-y-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Detail Pesanan</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Form Details */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="tableNumber" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                      Nomor Meja <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="tableNumber"
                      type="number"
                      required
                      min={1}
                      disabled={submitting}
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full rounded-xl border border-gray-300 bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:border-transparent transition disabled:bg-gray-100 disabled:text-gray-400"
                      placeholder="Contoh: 5"
                    />
                  </div>

                  <div>
                    <label htmlFor="customerName" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                      Nama Pelanggan (Opsional)
                    </label>
                    <input
                      id="customerName"
                      type="text"
                      disabled={submitting}
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:border-transparent transition disabled:bg-gray-100 disabled:text-gray-400"
                      placeholder="Nama pemesan..."
                    />
                  </div>

                  <div>
                    <label htmlFor="notes" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                      Catatan (Opsional)
                    </label>
                    <textarea
                      id="notes"
                      rows={2}
                      disabled={submitting}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:border-transparent transition disabled:bg-gray-100 disabled:text-gray-400"
                      placeholder="Tambahkan catatan khusus..."
                    />
                  </div>
                </div>

                {/* Cart list */}
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2.5">Item Pesanan</h3>
                  {selectedItems.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-6 text-center text-xs text-gray-500 font-medium">
                      Klik menu di sebelah kiri untuk menambahkan item.
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100 border-y border-gray-200 max-h-64 overflow-y-auto">
                      {selectedItems.map((item) => (
                        <div key={item.menuId} className="flex items-center justify-between gap-3 py-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-xs sm:text-sm text-gray-900 truncate">{item.name}</p>
                            <p className="text-[11px] text-gray-500 mt-0.5 font-medium">{formatRupiah(item.price)}</p>
                          </div>

                          <div className="flex items-center gap-2.5">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                              <button
                                type="button"
                                disabled={submitting}
                                onClick={() => handleUpdateQuantity(item.menuId, -1)}
                                className="px-2 py-1 text-xs font-bold text-gray-700 hover:bg-gray-200 transition disabled:opacity-50 min-h-[32px] min-w-[28px]"
                              >
                                -
                              </button>
                              <span className="px-2 text-xs font-bold text-gray-900 font-mono">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                disabled={submitting}
                                onClick={() => handleUpdateQuantity(item.menuId, 1)}
                                className="px-2 py-1 text-xs font-bold text-gray-700 hover:bg-gray-200 transition disabled:opacity-50 min-h-[32px] min-w-[28px]"
                              >
                                +
                              </button>
                            </div>

                            {/* Remove button */}
                            <button
                              type="button"
                              disabled={submitting}
                              onClick={() => handleRemoveItem(item.menuId)}
                              className="text-gray-400 hover:text-red-600 p-1 transition disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded"
                              aria-label={`Hapus ${item.name}`}
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Subtotals & total */}
                {selectedItems.length > 0 && (
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-xs text-gray-500 font-medium">
                      <span>Total Item</span>
                      <span>{selectedItems.length} menu</span>
                    </div>
                    <div className="flex justify-between items-center text-base sm:text-lg font-extrabold text-gray-900 pt-2 border-t border-gray-100">
                      <span>Total Tagihan</span>
                      <span>{formatRupiah(totalAmount)}</span>
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={!isFormValid || submitting}
                  className="w-full rounded-xl bg-black py-3.5 text-xs sm:text-sm font-semibold text-white hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black min-h-[44px]"
                >
                  {submitting ? "Memproses..." : "Buat Pesanan"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
