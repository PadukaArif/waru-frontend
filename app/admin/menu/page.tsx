"use client";

import { useEffect, useState } from "react";
import {
  createMenu,
  deleteMenu,
  getMenus,
  updateMenu,
  uploadImage,
  type Menu,
  type MenuCategory,
} from "@/services/menu";
import PageHeader from "@/components/UI/PageHeader";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import MenuImage from "@/components/MenuImage";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "Heavy Food" as MenuCategory,
  isAvailable: true,
  isRecommended: false,
  imageUrl: "",
};

type FormState = typeof emptyForm;

export default function AdminMenuPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Format file tidak didukung. Gunakan JPG, JPEG, PNG, atau WEBP.");
      return;
    }

    try {
      setUploadingImage(true);
      setUploadError("");

      const response = await uploadImage(file);
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const fullUrl = `${API_URL}${response.url}`;
      
      handleChange("imageUrl", fullUrl);
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError(
        err instanceof Error ? err.message : "Gagal mengunggah gambar."
      );
    } finally {
      setUploadingImage(false);
    }
  }

  async function loadMenus() {
    try {
      setError("");
      const response = await getMenus(1, 100);
      setMenus(response.data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal mengambil data menu."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMenus();
  }, []);

  function handleChange(
    field: keyof FormState,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setIsModalOpen(false);
    setUploadError("");
  }

  function openCreateModal() {
    resetForm();
    setIsModalOpen(true);
  }

  function startEdit(menu: Menu) {
    setEditingId(menu._id);

    setForm({
      name: menu.name,
      description: menu.description,
      price: String(menu.price),
      category: menu.category,
      isAvailable: menu.isAvailable,
      isRecommended: menu.isRecommended,
      imageUrl: menu.imageUrl,
    });

    setIsModalOpen(true);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category,
        isAvailable: form.isAvailable,
        isRecommended: form.isRecommended,
        imageUrl: form.imageUrl.trim(),
      };

      if (!payload.name || !payload.description) {
        throw new Error("Nama dan deskripsi wajib diisi.");
      }

      if (!Number.isFinite(payload.price) || payload.price < 0) {
        throw new Error("Harga harus berupa angka yang valid.");
      }

      if (!payload.imageUrl) {
        throw new Error("Image URL wajib diisi. Silakan unggah gambar menu.");
      }

      if (editingId) {
        await updateMenu(editingId, payload);
      } else {
        await createMenu(payload);
      }

      resetForm();
      await loadMenus();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan menu."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Yakin ingin menghapus menu ini dari katalog?"
    );

    if (!confirmed) return;

    try {
      setError("");
      await deleteMenu(id);
      await loadMenus();

      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal menghapus menu."
      );
    }
  }

  return (
    <div className="page-container py-6 sm:py-8 md:py-10">
      <PageHeader
        title="Pengelolaan Katalog Menu"
        description="Kelola daftar hidangan, harga, foto produk, ketersediaan stok, dan menu rekomendasi."
        badge="Modul CRUD Admin"
        action={
          <Button variant="primary" onClick={openCreateModal}>
            + Tambah Menu Baru
          </Button>
        }
      />

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-xs sm:text-sm text-red-800 flex items-center justify-between shadow-xs font-semibold"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError("")}
            className="text-red-700 hover:text-red-950 font-bold text-xs ml-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded px-1.5 py-0.5"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Menu Cards Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base sm:text-lg font-bold text-[#293855]">
            Daftar Katalog Menu ({menus.length})
          </h2>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-64 animate-pulse rounded-2xl bg-slate-100 border border-slate-200" />
            ))}
          </div>
        ) : menus.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 p-8 sm:p-12 text-center text-xs sm:text-sm text-slate-500 bg-white shadow-xs space-y-3">
            <p className="font-semibold text-[#293855] text-base">Belum Ada Menu Dalam Katalog</p>
            <p className="text-slate-500 text-xs">Klik tombol &quot;Tambah Menu Baru&quot; untuk menambahkan hidangan pertama.</p>
            <Button variant="primary" onClick={openCreateModal}>
              + Tambah Menu Pertama
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {menus.map((menu) => (
              <article
                key={menu._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between transition-all duration-150 hover:border-slate-300 hover:shadow-sm"
              >
                <div>
                  <div className="aspect-4/3 overflow-hidden bg-slate-100 relative">
                    <MenuImage
                      src={menu.imageUrl}
                      alt={menu.name}
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                      {menu.isRecommended && (
                        <span className="rounded-md border border-amber-200 bg-amber-500 text-slate-900 px-2 py-0.5 text-[10px] font-bold shadow-xs">
                          Recommended
                        </span>
                      )}
                      {menu.isAvailable ? (
                        <span className="rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-[#204d28]">
                          Tersedia
                        </span>
                      ) : (
                        <span className="rounded-md bg-red-50 border border-red-200 px-2 py-0.5 text-[10px] font-bold text-red-700">
                          Habis
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base sm:text-lg font-extrabold text-[#293855] leading-tight">
                        {menu.name}
                      </h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 shrink-0">
                        {menu.category}
                      </span>
                    </div>

                    <p className="line-clamp-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {menu.description}
                    </p>

                    <p className="pt-2 font-black text-[#293855] text-base sm:text-lg">
                      Rp {menu.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 pt-3 flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => startEdit(menu)}
                    className="flex-1 text-xs min-h-[38px]"
                  >
                    Edit Menu
                  </Button>

                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => handleDelete(menu._id)}
                    className="flex-1 text-xs min-h-[38px]"
                  >
                    Hapus
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Form Modal Dialog - Bounded height with internal scroll for small screens */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#293855]/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl bg-white shadow-xl border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6 shrink-0 bg-slate-50/50">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4265D6]">
                  {editingId ? "Edit Item Catalog" : "Tambah Item Catalog Baru"}
                </span>
                <h2 className="text-lg sm:text-xl font-black text-[#293855]">
                  {editingId ? "Perbarui Data Menu" : "Formulir Menu Baru"}
                </h2>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4265D6]"
                aria-label="Tutup modal"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body - Internal Scrollable */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto">
              <div className="p-5 sm:p-6 space-y-5 flex-1">
                <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
                  <Input
                    label="Nama Menu *"
                    value={form.name}
                    onChange={(event) => handleChange("name", event.target.value)}
                    required
                    placeholder="Contoh: Nasi Goreng Waru Special"
                  />

                  <Input
                    label="Harga (Rp) *"
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(event) => handleChange("price", event.target.value)}
                    required
                    placeholder="25000"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs sm:text-sm font-bold text-[#293855]">
                    Deskripsi Menu *
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(event) => handleChange("description", event.target.value)}
                    required
                    rows={3}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm text-[#293855] focus-visible:outline-2 focus-visible:outline-[#4265D6] transition"
                    placeholder="Jelaskan bahan utama dan rasa..."
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs sm:text-sm font-bold text-[#293855]">
                    Kategori Menu *
                  </label>
                  <select
                    value={form.category}
                    onChange={(event) =>
                      handleChange("category", event.target.value as MenuCategory)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-[#293855] font-semibold focus-visible:outline-2 focus-visible:outline-[#4265D6] transition"
                  >
                    <option value="Heavy Food">Heavy Food (Makanan Berat)</option>
                    <option value="Light Food">Light Food (Cemilan / Minuman)</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs sm:text-sm font-bold text-[#293855]">
                    Foto Menu *
                  </label>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                    <div className="relative aspect-4/3 w-full max-w-[140px] overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shrink-0">
                      <MenuImage
                        src={form.imageUrl}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <label
                          htmlFor="image-upload"
                          className={`rounded-xl bg-[#4265D6] px-4 py-2 text-xs font-bold text-white cursor-pointer hover:bg-blue-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4265D6] min-h-[38px] inline-flex items-center justify-center ${
                            uploadingImage ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {uploadingImage ? "Mengunggah File..." : "Pilih File Gambar"}
                        </label>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/png, image/jpeg, image/jpg, image/webp"
                          onChange={handleFileChange}
                          disabled={uploadingImage}
                          className="hidden"
                        />

                        {form.imageUrl && (
                          <Button
                            type="button"
                            variant="danger"
                            onClick={() => handleChange("imageUrl", "")}
                            className="text-xs py-1.5 px-3 min-h-[38px]"
                          >
                            Hapus Gambar
                          </Button>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Format yang didukung: PNG, JPG, JPEG, WEBP.
                      </p>
                      {uploadError && (
                        <p className="text-xs font-semibold text-red-600">
                          {uploadError}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer text-xs sm:text-sm font-bold text-[#293855] select-none">
                    <input
                      type="checkbox"
                      checked={form.isAvailable}
                      onChange={(event) => handleChange("isAvailable", event.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-[#4265D6] focus:ring-[#4265D6]"
                    />
                    <span>Tersedia untuk Dipesan</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer text-xs sm:text-sm font-bold text-[#293855] select-none">
                    <input
                      type="checkbox"
                      checked={form.isRecommended}
                      onChange={(event) => handleChange("isRecommended", event.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-[#4265D6] focus:ring-[#4265D6]"
                    />
                    <span>Tandai Rekomendasi</span>
                  </label>
                </div>
              </div>

              {/* Modal Sticky Footer Actions */}
              <div className="border-t border-slate-100 p-4 sm:p-5 shrink-0 bg-slate-50/80 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="min-h-[42px]"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={saving}
                  disabled={saving || uploadingImage}
                  className="min-h-[42px] min-w-[140px]"
                >
                  {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Menu"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
