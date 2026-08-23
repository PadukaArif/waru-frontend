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
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Admin Menu
          </h1>

          <p className="mt-2 text-gray-600">
            Kelola menu makanan WARU.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <section className="mb-10 rounded-xl border p-6">
          <h2 className="mb-6 text-xl font-semibold">
            {editingId ? "Edit Menu" : "Tambah Menu"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid gap-5 md:grid-cols-2"
          >
            <div>
              <label className="mb-2 block text-sm font-medium">
                Nama
              </label>

              <input
                value={form.name}
                onChange={(event) =>
                  handleChange("name", event.target.value)
                }
                required
                className="w-full rounded-lg border px-4 py-3"
                placeholder="Nasi Goreng Waru"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Harga
              </label>

              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(event) =>
                  handleChange("price", event.target.value)
                }
                required
                className="w-full rounded-lg border px-4 py-3"
                placeholder="25000"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">
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
                rows={4}
                className="w-full rounded-lg border px-4 py-3"
                placeholder="Deskripsi menu..."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
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
                className="w-full rounded-lg border px-4 py-3"
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
              <label className="mb-2 block text-sm font-medium">
                Gambar Menu
              </label>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {/* Preview Container */}
                <div className="relative aspect-video w-full max-w-[200px] overflow-hidden rounded-lg border bg-gray-50 flex items-center justify-center">
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
                  <div className="flex flex-wrap items-center gap-3">
                    <label
                      htmlFor="image-upload"
                      className={`rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white cursor-pointer hover:bg-gray-800 transition ${
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
                        className="rounded-lg border border-red-300 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition"
                      >
                        Hapus Gambar
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
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

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(event) =>
                  handleChange(
                    "isAvailable",
                    event.target.checked
                  )
                }
              />

              <span className="text-sm font-medium">
                Tersedia
              </span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.isRecommended}
                onChange={(event) =>
                  handleChange(
                    "isRecommended",
                    event.target.checked
                  )
                }
              />

              <span className="text-sm font-medium">
                Recommended
              </span>
            </label>

            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={saving || uploadingImage}
                className="rounded-lg bg-black px-5 py-3 font-medium text-white disabled:opacity-50"
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
                  className="rounded-lg border px-5 py-3 font-medium"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </section>

        <section>
          <h2 className="mb-5 text-xl font-semibold">
            Daftar Menu
          </h2>

          {loading ? (
            <p className="text-gray-500">
              Memuat menu...
            </p>
          ) : menus.length === 0 ? (
            <div className="rounded-xl border p-8 text-center text-gray-500">
              Belum ada menu.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {menus.map((menu) => (
                <article
                  key={menu._id}
                  className="overflow-hidden rounded-xl border"
                >
                  <div className="aspect-video overflow-hidden bg-gray-100">
                    <img
                      src={menu.imageUrl}
                      alt={menu.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-semibold">
                      {menu.name}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                      {menu.description}
                    </p>

                    <p className="mt-3 font-semibold">
                      Rp{" "}
                      {menu.price.toLocaleString("id-ID")}
                    </p>

                    <div className="mt-5 flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(menu)}
                        className="flex-1 rounded-lg border px-3 py-2 text-sm font-medium"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(menu._id)
                        }
                        className="flex-1 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600"
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
      </div>
    </main>
  );
}