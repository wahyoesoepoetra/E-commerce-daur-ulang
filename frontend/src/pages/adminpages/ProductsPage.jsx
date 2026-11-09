import { useEffect, useRef, useState } from "react";
import { apiRequest } from "../../utils/api";

const emptyForm = {
  name: "",
  description: "",
  category_id: "",
  price: "",
  stock: "0",
  slug: "",
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    let active = true;

    const loadInitialData = async () => {
      try {
        const [productResult, categoryResult] = await Promise.all([
          apiRequest("/products"),
          apiRequest("/categories"),
        ]);

        if (!Array.isArray(productResult?.data)) {
          throw new Error("Format daftar produk dari Laravel tidak valid.");
        }
        if (!Array.isArray(categoryResult?.data)) {
          throw new Error("Format daftar kategori dari Laravel tidak valid.");
        }

        if (active) {
          setProducts(productResult.data);
          setCategories(categoryResult.data);
          setForm((current) => ({
            ...current,
            category_id:
              current.category_id ||
              String(categoryResult.data[0]?.category_id ?? ""),
          }));
        }
      } catch (loadError) {
        if (active) setError(loadError.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadInitialData();

    return () => {
      active = false;
    };
  }, []);

  const refreshProducts = async () => {
    const result = await apiRequest("/products");
    if (!Array.isArray(result?.data)) {
      throw new Error("Format daftar produk dari Laravel tidak valid.");
    }

    setProducts(result.data);
  };

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const resetForm = () => {
    setForm({
      ...emptyForm,
      category_id: String(categories[0]?.category_id ?? ""),
    });
    setImageFile(null);
    setEditingId(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);

    const isEditing = editingId !== null;
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => payload.append(key, value));
    if (imageFile) payload.append("img", imageFile);
    if (isEditing) payload.append("_method", "PUT");

    try {
      const result = await apiRequest(
        isEditing ? `/products/${editingId}` : "/products",
        { method: "POST", body: payload },
      );

      resetForm();
      setMessage(
        result?.message ||
          (isEditing
            ? "Produk berhasil diperbarui."
            : "Produk berhasil ditambahkan."),
      );

      try {
        await refreshProducts();
      } catch (refreshError) {
        setError(`Data tersimpan, tetapi daftar gagal dimuat: ${refreshError.message}`);
      }
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.product_id);
    setForm({
      name: product.name,
      description: product.description ?? "",
      category_id: String(product.category_id),
      price: String(Number(product.price)),
      stock: String(product.stock),
      slug: product.slug,
    });
    setImageFile(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
    setMessage("");
    setError("");
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Hapus produk "${product.name}"?`)) return;

    setMessage("");
    setError("");
    setDeletingId(product.product_id);

    try {
      const result = await apiRequest(`/products/${product.product_id}`, {
        method: "DELETE",
      });

      if (editingId === product.product_id) resetForm();
      setMessage(result?.message || "Produk berhasil dihapus.");

      try {
        await refreshProducts();
      } catch (refreshError) {
        setError(`Produk terhapus, tetapi daftar gagal dimuat: ${refreshError.message}`);
      }
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancelEdit = () => {
    resetForm();
    setMessage("");
    setError("");
  };

  const editingProduct = products.find(
    (product) => product.product_id === editingId,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Kelola Produk</h1>
        <p className="mt-1 text-gray-600">Data produk dari database Laravel</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-xl border bg-white p-5 md:grid-cols-2"
      >
        <h2 className="text-xl font-semibold md:col-span-2">
          {editingId === null ? "Tambah Produk" : "Edit Produk"}
        </h2>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nama produk"
          className="rounded border p-2"
          required
        />

        <input
          name="slug"
          value={form.slug}
          onChange={handleChange}
          placeholder="slug-produk"
          className="rounded border p-2"
          required
        />

        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          className="rounded border p-2"
          required
          disabled={categories.length === 0}
        >
          <option value="" disabled>
            {categories.length === 0 ? "Kategori tidak tersedia" : "Pilih kategori"}
          </option>
          {categories.map((category) => (
            <option key={category.category_id} value={category.category_id}>
              {category.category}
            </option>
          ))}
        </select>

        <input
          name="price"
          type="number"
          min="0"
          value={form.price}
          onChange={handleChange}
          placeholder="Harga"
          className="rounded border p-2"
          required
        />

        <input
          name="stock"
          type="number"
          min="0"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stok"
          className="rounded border p-2"
          required
        />

        <label className="space-y-2 text-sm text-gray-700">
          <span>Foto produk (JPG, PNG, atau WebP; maksimal 5 MB)</span>
          <input
            ref={imageInputRef}
            name="img"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
            className="block w-full rounded border p-2"
          />
        </label>

        {editingProduct?.img && (
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <img
              src={editingProduct.img}
              alt={`Foto ${editingProduct.name} saat ini`}
              className="h-14 w-14 rounded object-cover"
            />
            <span>
              Foto saat ini dipertahankan jika Anda tidak memilih foto baru.
              {imageFile && ` Foto pengganti: ${imageFile.name}`}
            </span>
          </div>
        )}

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Deskripsi produk"
          className="rounded border p-2 md:col-span-2"
          rows="3"
        />

        <button
          type="submit"
          disabled={saving || categories.length === 0}
          className="rounded bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 md:col-span-2"
        >
          {saving
            ? "Menyimpan..."
            : editingId === null
              ? "Simpan Produk"
              : "Perbarui Produk"}
        </button>

        {editingId !== null && (
          <button
            type="button"
            onClick={handleCancelEdit}
            className="rounded border px-4 py-2 font-medium text-gray-700 hover:bg-gray-100 md:col-span-2"
          >
            Batal Edit
          </button>
        )}

        {message && (
          <p role="status" className="text-emerald-700 md:col-span-2">
            {message}
          </p>
        )}
        {error && (
          <p role="alert" className="text-red-600 md:col-span-2">
            {error}
          </p>
        )}
      </form>

      {loading ? (
        <p>Memuat produk dan kategori...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Foto</th>
                <th className="p-3">Nama</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Harga</th>
                <th className="p-3">Stok</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.product_id} className="border-t">
                  <td className="p-3">
                    {product.img ? (
                      <img
                        src={product.img}
                        alt={product.name}
                        className="h-14 w-14 rounded object-cover"
                      />
                    ) : (
                      <span className="text-sm text-gray-500">Belum ada foto</span>
                    )}
                  </td>
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3">
                    Rp{Number(product.price).toLocaleString("id-ID")}
                  </td>
                  <td className="p-3">{product.stock}</td>
                  <td className="space-x-2 p-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(product)}
                      className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product)}
                      disabled={deletingId !== null}
                      className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === product.product_id ? "Menghapus..." : "Hapus"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
