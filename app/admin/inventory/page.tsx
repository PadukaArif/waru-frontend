"use client";

import { useEffect, useState } from "react";
import {
  getInventoryItems,
  createInventoryItem,
  updateInventoryItem,
  adjustInventoryStock,
  deleteInventoryItem,
  type InventoryItem,
  type InventoryCategory,
  type InventoryUnit,
} from "@/services/inventory";
import PageHeader from "@/components/UI/PageHeader";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";

const emptyForm = {
  name: "",
  category: "food" as InventoryCategory,
  unit: "kg" as InventoryUnit,
  quantity: "0",
  minimumStock: "1",
  costPrice: "0",
  supplier: "",
  notes: "",
};

type FormState = typeof emptyForm;

function getStockStatus(qty: number, minStock: number) {
  if (qty === 0) {
    return {
      label: "OUT OF STOCK",
      badgeClass: "bg-red-50 text-red-700 border-red-200",
      indicatorClass: "bg-red-500",
    };
  }
  if (qty <= minStock) {
    return {
      label: "LOW STOCK",
      badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
      indicatorClass: "bg-amber-500",
    };
  }
  return {
    label: "SAFE",
    badgeClass: "bg-emerald-50 text-green-dark border-emerald-200",
    indicatorClass: "bg-emerald-500",
  };
}

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal State (Create / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  // Restock Modal State
  const [restockItem, setRestockItem] = useState<InventoryItem | null>(null);
  const [restockQty, setRestockQty] = useState("");
  const [restockReason, setRestockReason] = useState("");
  const [restocking, setRestocking] = useState(false);

  async function loadData() {
    try {
      setError("");
      const res = await getInventoryItems(1, 100);
      setItems(res.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengambil data inventaris.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setIsModalOpen(false);
  }

  function openCreateModal() {
    resetForm();
    setIsModalOpen(true);
  }

  function startEdit(item: InventoryItem) {
    setEditingId(item._id);
    setForm({
      name: item.name,
      category: item.category,
      unit: item.unit,
      quantity: String(item.quantity),
      minimumStock: String(item.minimumStock),
      costPrice: String(item.costPrice),
      supplier: item.supplier || "",
      notes: item.notes || "",
    });
    setIsModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");

      const payload = {
        name: form.name.trim(),
        category: form.category,
        unit: form.unit,
        quantity: Number(form.quantity),
        minimumStock: Number(form.minimumStock),
        costPrice: Number(form.costPrice),
        supplier: form.supplier.trim() || undefined,
        notes: form.notes.trim() || undefined,
      };

      if (!payload.name) throw new Error("Nama barang wajib diisi.");
      if (payload.quantity < 0) throw new Error("Stok tidak boleh negatif.");
      if (payload.minimumStock < 0) throw new Error("Batas minimum stok tidak boleh negatif.");

      if (editingId) {
        await updateInventoryItem(editingId, payload);
      } else {
        await createInventoryItem(payload);
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan item inventaris.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRestockSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!restockItem) return;

    try {
      setRestocking(true);
      const adjustment = Number(restockQty);
      if (!Number.isFinite(adjustment) || adjustment === 0) {
        throw new Error("Jumlah penyesuaian harus berupa angka yang valid.");
      }

      await adjustInventoryStock(restockItem._id, {
        adjustment,
        reason: restockReason.trim() || "Adjustment stok operasional",
      });

      setRestockItem(null);
      setRestockQty("");
      setRestockReason("");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memperbarui stok.");
    } finally {
      setRestocking(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Hapus item inventaris '${name}'?`)) return;
    try {
      setError("");
      await deleteInventoryItem(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus item inventaris.");
    }
  }

  const totalValue = items.reduce((sum, item) => sum + item.quantity * item.costPrice, 0);
  const outOfStockCount = items.filter((i) => i.quantity === 0).length;
  const lowStockCount = items.filter((i) => i.quantity > 0 && i.quantity <= i.minimumStock).length;
  const safeStockCount = items.filter((i) => i.quantity > i.minimumStock).length;

  return (
    <div className="page-container py-6 sm:py-8 md:py-10 space-y-6">
      <PageHeader
        title="Manajemen Inventaris Warung"
        description="Pantau stok bahan baku real-time, kelola batas minimum, dan lakukan restock operasional."
        badge="Modul Stok Admin"
        action={
          <Button variant="primary" onClick={openCreateModal}>
            + Tambah Item Inventaris
          </Button>
        }
      />

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs sm:text-sm text-red-800 flex items-center justify-between shadow-xs font-semibold"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError("")}
            className="text-red-700 hover:text-red-950 font-bold text-xs px-2 py-1 rounded"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Overview Cards */}
      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-1">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Total Item Inventaris</p>
          <p className="text-2xl sm:text-3xl font-black text-navy">{items.length} <span className="text-xs font-semibold text-slate-500">bahan</span></p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-xs space-y-1">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">Stok Dalam Batas Aman</p>
          <p className="text-2xl sm:text-3xl font-black text-green-dark">{safeStockCount} <span className="text-xs font-semibold text-emerald-700">item</span></p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5 shadow-xs space-y-1">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800">Stok Menipis (Low Stock)</p>
          <p className="text-2xl sm:text-3xl font-black text-amber-900">{lowStockCount} <span className="text-xs font-semibold text-amber-700">item</span></p>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50/40 p-5 shadow-xs space-y-1">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-red-800">Stok Habis (Out of Stock)</p>
          <p className="text-2xl sm:text-3xl font-black text-red-700">{outOfStockCount} <span className="text-xs font-semibold text-red-600">item</span></p>
        </div>
      </section>

      {/* Inventory Table */}
      <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-navy">Daftar Stok Bahan Baku</h2>
            <p className="text-xs text-slate-500">Nilai total estimasi modal bahan: <strong className="text-navy">Rp {totalValue.toLocaleString("id-ID")}</strong></p>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400 font-medium">Memuat data inventaris...</div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <p className="text-sm font-bold text-navy">Belum ada data inventory</p>
            <p className="text-xs text-slate-500">Tambahkan barang untuk mulai memantau stok bahan baku operasional.</p>
            <Button variant="primary" onClick={openCreateModal}>+ Tambah Barang Pertama</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-navy">
              <thead className="bg-slate-100/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5">Nama Bahan</th>
                  <th className="px-4 py-3.5">Kategori</th>
                  <th className="px-4 py-3.5">Stok Saat Ini</th>
                  <th className="px-4 py-3.5">Min. Stok</th>
                  <th className="px-4 py-3.5">Harga Modal / Unit</th>
                  <th className="px-4 py-3.5">Status Stok</th>
                  <th className="px-4 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y ">
                {items.map((item) => {
                  const status = getStockStatus(item.quantity, item.minimumStock);
                  return (
                    <tr key={item._id} className="hover:bg-slate-50/60 transition">
                      <td className="px-4 py-3.5 font-extrabold text-navy">
                        {item.name}
                        {item.supplier && (
                          <span className="block text-[10px] font-normal text-slate-400">Supplier: {item.supplier}</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-black text-navy text-sm sm:text-base">
                        {item.quantity} <span className="text-xs font-semibold text-slate-500">{item.unit}</span>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-600">
                        {item.minimumStock} {item.unit}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-700">
                        Rp {item.costPrice.toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold border ${status.badgeClass}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${status.indicatorClass}`} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setRestockItem(item);
                            setRestockQty("");
                            setRestockReason("");
                          }}
                          className="px-2.5 py-1 text-xs font-bold text-blue-primary bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg transition"
                        >
                          Restock
                        </button>
                        <button
                          type="button"
                          onClick={() => startEdit(item)}
                          className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 hover:bg-slate-200 rounded-lg transition"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item._id, item.name)}
                          className="px-2 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Restock Adjustment Modal */}
      {restockItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-black text-navy">Penyesuaian Stok (Restock)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tambah atau kurangi stok bahan <strong className="text-navy">{restockItem.name}</strong>. Kuantitas stok saat ini: <strong className="text-navy">{restockItem.quantity} {restockItem.unit}</strong>.
            </p>

            <form onSubmit={handleRestockSubmit} className="space-y-4">
              <Input
                label="Jumlah Penyesuaian (+ untuk tambah, - untuk kurangi) *"
                type="number"
                step="any"
                required
                value={restockQty}
                onChange={(e) => setRestockQty(e.target.value)}
                placeholder="Contoh: 10 atau -2"
              />

              <Input
                label="Alasan / Catatan Penyesuaian"
                type="text"
                value={restockReason}
                onChange={(e) => setRestockReason(e.target.value)}
                placeholder="Contoh: Pembelian supplier pasar pagi"
              />

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => setRestockItem(null)}>
                  Batal
                </Button>
                <Button type="submit" variant="primary" loading={restocking} disabled={restocking || !restockQty}>
                  Simpan Penyesuaian
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create / Edit Inventory Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-navy">{editingId ? "Edit Item Inventaris" : "Tambah Item Inventaris Baru"}</h3>
              <button type="button" onClick={resetForm} className="text-slate-400 hover:text-slate-700 text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nama Bahan / Barang *"
                required
                value={form.name}
                onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))}
                placeholder="Contoh: Daging Sapi Fresh"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy mb-1">Kategori *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((c) => ({ ...c, category: e.target.value as InventoryCategory }))}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-navy font-semibold"
                  >
                    <option value="food">Makanan (Food)</option>
                    <option value="beverage">Minuman (Beverage)</option>
                    <option value="packaging">Kemasan (Packaging)</option>
                    <option value="equipment">Peralatan (Equipment)</option>
                    <option value="other">Lainnya (Other)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy mb-1">Satuan (Unit) *</label>
                  <select
                    value={form.unit}
                    onChange={(e) => setForm((c) => ({ ...c, unit: e.target.value as InventoryUnit }))}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-navy font-semibold"
                  >
                    <option value="kg">kg (Kilogram)</option>
                    <option value="pcs">pcs (Pieces)</option>
                    <option value="liter">liter (Liter)</option>
                    <option value="gram">gram (Gram)</option>
                    <option value="ml">ml (Milliliter)</option>
                    <option value="box">box (Box)</option>
                    <option value="pack">pack (Pack)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Input
                  label="Stok *"
                  type="number"
                  step="any"
                  min="0"
                  required
                  value={form.quantity}
                  onChange={(e) => setForm((c) => ({ ...c, quantity: e.target.value }))}
                />
                <Input
                  label="Min. Stok *"
                  type="number"
                  step="any"
                  min="0"
                  required
                  value={form.minimumStock}
                  onChange={(e) => setForm((c) => ({ ...c, minimumStock: e.target.value }))}
                />
                <Input
                  label="Harga Modal (Rp)"
                  type="number"
                  min="0"
                  value={form.costPrice}
                  onChange={(e) => setForm((c) => ({ ...c, costPrice: e.target.value }))}
                />
              </div>

              <Input
                label="Supplier (Opsional)"
                value={form.supplier}
                onChange={(e) => setForm((c) => ({ ...c, supplier: e.target.value }))}
                placeholder="Nama pasar / toko supplier"
              />

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={resetForm}>Batal</Button>
                <Button type="submit" variant="primary" loading={saving} disabled={saving}>
                  {editingId ? "Simpan Perubahan" : "Tambah Item"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
