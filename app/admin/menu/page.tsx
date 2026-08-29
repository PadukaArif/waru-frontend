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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
        throw new Error("Image URL wajib diisi.");
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
      "Yakin ingin menghapus menu ini?"
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
    <main className="flex-1 bg-gray-50/30">
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-6 sm:mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
            Admin Menu
          </h1>

          <p className="mt-1.5 text-xs sm:text-sm text-gray-600">
            Kelola item makanan dan minuman WARU.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-3.5 sm:p-4 text-xs sm:text-sm text-red-800 flex items-center justify-between shadow-2xs"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-700 hover:text-red-950 font-semibold text-xs ml-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded px-1.5 py-0.5"
            >
              Tutup
            </button>
          </div>
        )}

        <section className="mb-8 sm:mb-10 rounded-2xl border border-gray-200 p-4 sm:p-6 bg-white shadow-2xs">
          <h2 className="mb-4 sm:mb-6 text-lg sm:text-xl font-semibold text-gray-900">
            {editingId ? "Edit Menu" : "Tambah Menu"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid gap-4 sm:gap-5 md:grid-cols-2"
          >
            <div>
              <label className="mb-1.5 block text-xs sm:text-sm font-medium text-gray-700">
                Nama Menu
              </label>

              <input
                value={form.name}
                onChange={(event) =>
                  handleChange("name", event.target.value)
                }
                required
                className="w-full rounded-xl border border-gray-300 bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:border-transparent transition"
                placeholder="Nasi Goreng Waru"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs sm:text-sm font-medium text-gray-700">
                Harga (Rp)
              </label>

              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(event) =>
                  handleChange("price", event.target.value)
                }
                required
                className="w-full rounded-xl border border-gray-300 bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:border-transparent transition"
                placeholder="25000"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs sm:text-sm font-medium text-gray-700">
                Deskripsi
              </label>

              <textarea
                value={form.description}
                onChange={(event) =>
                  handleChange(
                    "description",
                    event.target.value
                  )
                }
                required
                rows={3}
                className="w-full rounded-xl border border-gray-300 bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:border-transparent transition"
                placeholder="Deskripsi singkat menu..."
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs sm:text-sm font-medium text-gray-700">
                Kategori
              </label>

              <select
                value={form.category}
                onChange={(event) =>
                  handleChange(
                    "category",
                    event.target.value as MenuCategory
                  )
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:border-transparent transition"
              >
                <option value="Heavy Food">
                  Heavy Food
                </option>
                <option value="Light Food">
                  Light Food
                </option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs sm:text-sm font-medium text-gray-700">
                Gambar Menu
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* Preview Container */}
                <div className="relative aspect-video w-full max-w-[160px] sm:max-w-[200px] overflow-hidden rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center shrink-0">
                  {form.imageUrl ? (
                    <img
                      src={form.imageUrl}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">Tidak ada gambar</span>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <label
                      htmlFor="image-upload"
                      className={`rounded-xl bg-black px-4 py-2.5 text-xs sm:text-sm font-semibold text-white cursor-pointer hover:bg-gray-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black min-h-[40px] inline-flex items-center justify-center ${
                        uploadingImage ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {uploadingImage ? "Mengunggah..." : "Pilih File Gambar"}
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
                      <button
                        type="button"
                        onClick={() => handleChange("imageUrl", "")}
                        className="rounded-xl border border-red-300 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-red-600 hover:bg-red-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 min-h-[40px]"
                      >
                        Hapus Gambar
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] sm:text-xs text-gray-500">
                    Mendukung format JPG, JPEG, PNG, WEBP
                  </p>
                  {uploadError && (
                    <p className="text-xs font-medium text-red-500">
                      {uploadError}
                    </p>
                  )}
                </div>
              </div>
              
              <input
                type="hidden"
                value={form.imageUrl}
                required
              />
            </div>

            <label className="flex items-center gap-3 min-h-[44px] cursor-pointer text-xs sm:text-sm font-medium text-gray-800 select-none">
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(event) =>
                  handleChange(
                    "isAvailable",
                    event.target.checked
                  )
                }
                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
              />

              <span>Tersedia</span>
            </label>

            <label className="flex items-center gap-3 min-h-[44px] cursor-pointer text-xs sm:text-sm font-medium text-gray-800 select-none">
              <input
                type="checkbox"
                checked={form.isRecommended}
                onChange={(event) =>
                  handleChange(
                    "isRecommended",
                    event.target.checked
                  )
                }
                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
              />

              <span>Recommended</span>
            </label>

            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 md:col-span-2 pt-2">
              <button
                type="submit"
                disabled={saving || uploadingImage}
                className="rounded-xl bg-black px-5 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black min-h-[44px] flex items-center justify-center"
              >
                {saving
                  ? "Menyimpan..."
                  : editingId
                    ? "Simpan Perubahan"
                    : "Tambah Menu"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-gray-300 px-5 py-3 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black min-h-[44px] flex items-center justify-center"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </section>

        <section>
          <h2 className="mb-4 sm:mb-5 text-lg sm:text-xl font-semibold text-gray-900">
            Daftar Menu
          </h2>

          {loading ? (
            <p className="text-xs sm:text-sm text-gray-500">
              Memuat menu...
            </p>
          ) : menus.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 p-8 text-center text-xs sm:text-sm text-gray-500 bg-white shadow-2xs">
              Belum ada menu.
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {menus.map((menu) => (
                <article
                  key={menu._id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xs flex flex-col justify-between"
                >
                  <div className="aspect-video overflow-hidden bg-gray-100 relative">
                    <img
                      src={menu.imageUrl}
                      alt={menu.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                        {menu.name}
                      </h3>

                      <p className="mt-1.5 line-clamp-2 text-xs sm:text-sm text-gray-600">
                        {menu.description}
                      </p>

                      <p className="mt-2.5 font-semibold text-sm sm:text-base text-gray-900">
                        Rp {menu.price.toLocaleString("id-ID")}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(menu)}
                        className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black min-h-[38px]"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(menu._id)
                        }
                        className="flex-1 rounded-xl border border-red-200 bg-red-50/50 px-3 py-2 text-xs sm:text-sm font-semibold text-red-600 hover:bg-red-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 min-h-[38px]"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}