"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMenus, type Menu } from "@/services/menu";
import { createOrder } from "@/services/order";
import MenuImage from "@/components/MenuImage";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import PageHeader from "@/components/UI/PageHeader";

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
    <div className="page-container py-6 sm:py-8 md:py-10">
      <Link
        href="/order"
        className="mb-4 inline-flex items-center text-xs sm:text-sm font-semibold text-blue-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-primary rounded px-1"
      >
        ← Kembali ke Daftar Pesanan
      </Link>

      <PageHeader
        title="Buat Pesanan Meja Baru"
        description="Pilih menu dan tentukan nomor meja untuk mencatat pesanan pelanggan."
        badge="Kasir & Order Entry"
      />

      {submitError && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 text-xs sm:text-sm text-red-800 border border-red-200 shadow-xs font-semibold">
          {submitError}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Menu Selection (Left) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
              <h2 className="text-base sm:text-lg font-bold text-navy">Pilih Menu Kategori</h2>
              <span className="text-xs text-slate-500 font-semibold">{menus.length} item tersedia</span>
            </div>

            {loadingMenus ? (
              <div className="grid gap-3.5 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-20 animate-pulse rounded-xl bg-slate-100" />
                ))}
              </div>
            ) : menusError ? (
              <p className="text-center text-xs sm:text-sm text-red-600 py-6 font-semibold">{menusError}</p>
            ) : menus.length === 0 ? (
              <p className="text-center text-xs sm:text-sm text-slate-500 py-6 font-semibold">Tidak ada menu yang tersedia saat ini.</p>
            ) : (
              <div className="grid gap-3.5 sm:grid-cols-2">
                {menus.map((menu) => {
                  const cartItem = selectedItems.find((item) => item.menuId === menu._id);
                  return (
                    <div
                      key={menu._id}
                      onClick={() => handleAddItem(menu)}
                      className={`group relative flex gap-3.5 overflow-hidden rounded-xl border p-3 transition-all duration-150 cursor-pointer select-none ${
                        cartItem
                          ? "border-blue-primary bg-blue-50/40 shadow-xs"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100 relative">
                        <MenuImage
                          src={menu.imageUrl}
                          alt={menu.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <div className="flex flex-col justify-between py-0.5 min-w-0 flex-1">
                        <div>
                          <h3 className="font-bold text-xs sm:text-sm text-navy truncate group-hover:text-blue-primary transition-colors">{menu.name}</h3>
                          <span className="text-[10px] text-slate-500 font-semibold">{menu.category}</span>
                        </div>
                        <p className="font-black text-xs sm:text-sm text-navy">{formatRupiah(menu.price)}</p>
                      </div>
                      {cartItem && (
                        <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-primary text-[11px] font-black text-white shadow-xs">
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
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-6 sticky top-20">
            <h2 className="text-base sm:text-lg font-bold text-navy border-b border-slate-100 pb-3">Rincian Order</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Form Details */}
              <div className="space-y-4">
                <Input
                  id="tableNumber"
                  label="Nomor Meja *"
                  type="number"
                  required
                  min={1}
                  disabled={submitting}
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="Contoh: 5"
                />

                <Input
                  id="customerName"
                  label="Nama Pelanggan (Opsional)"
                  type="text"
                  disabled={submitting}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nama pemesan..."
                />

                <div>
                  <label htmlFor="notes" className="block text-xs sm:text-sm font-bold text-navy mb-1.5">
                    Catatan Pesanan (Opsional)
                  </label>
                  <textarea
                    id="notes"
                    rows={2}
                    disabled={submitting}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className={`w-full rounded-xl border border-slate-300 px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm focus-visible:outline-2 focus-visible:outline-blue-primary transition ${
                      submitting ? "bg-slate-100 text-slate-400" : "bg-white text-navy"
                    }`}
                    placeholder="Contoh: Tanpa pedas, es sedikit..."
                  />
                </div>
              </div>

              {/* Cart list */}
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-navy mb-2.5">Daftar Item ({selectedItems.length})</h3>
                {selectedItems.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-6 text-center text-xs text-slate-500 font-semibold">
                    Klik item menu di sebelah kiri untuk menambah ke keranjang.
                  </div>
                ) : (
                  <div className="divide-y  border-y border-slate-200 max-h-64 overflow-y-auto pr-1">
                    {selectedItems.map((item) => (
                      <div key={item.menuId} className="flex items-center justify-between gap-3 py-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-xs sm:text-sm text-navy truncate">{item.name}</p>
                          <p className="text-[11px] text-slate-500 font-semibold">{formatRupiah(item.price)}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Quantity Controls - Enlarged for Mobile Usability */}
                          <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-slate-50 shrink-0">
                            <button
                              type="button"
                              disabled={submitting}
                              onClick={() => handleUpdateQuantity(item.menuId, -1)}
                              className="h-9 w-9 flex items-center justify-center text-sm font-extrabold text-navy hover:bg-slate-200 transition disabled:opacity-50 active:bg-slate-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-primary"
                              aria-label="Kurangi jumlah"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-xs font-black text-navy font-mono select-none">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              disabled={submitting}
                              onClick={() => handleUpdateQuantity(item.menuId, 1)}
                              className="h-9 w-9 flex items-center justify-center text-sm font-extrabold text-navy hover:bg-slate-200 transition disabled:opacity-50 active:bg-slate-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-primary"
                              aria-label="Tambah jumlah"
                            >
                              +
                            </button>
                          </div>

                          {/* Remove button */}
                          <button
                            type="button"
                            disabled={submitting}
                            onClick={() => handleRemoveItem(item.menuId)}
                            className="text-slate-400 hover:text-red-600 p-1.5 transition disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded"
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
                <div className="border-t border-slate-200 pt-4 space-y-2">
                  <div className="flex justify-between text-xs text-slate-500 font-semibold">
                    <span>Total Item</span>
                    <span>{selectedItems.length} jenis menu</span>
                  </div>
                  <div className="flex justify-between items-center text-base sm:text-lg font-black text-navy pt-2 border-t border-slate-100">
                    <span>Total Tagihan</span>
                    <span>{formatRupiah(totalAmount)}</span>
                  </div>
                </div>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                variant="primary"
                loading={submitting}
                disabled={!isFormValid || submitting}
                className="w-full text-sm sm:text-base py-3.5"
              >
                Buat Pesanan Sekarang
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

