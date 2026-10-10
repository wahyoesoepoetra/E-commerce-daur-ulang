import { useMemo, useState } from "react";

const categoryPrice = {
  kayu: 45000,
  plastik: 30000,
  kaca: 50000,
  besi: 65000,
  tekstil: 35000,
  elektronik: 70000,
  lainnya: 25000,
};

const conditionFactor = {
  bagus: 1,
  layak: 0.75,
  rusak: 0.45,
};

export default function BuyBackPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    itemName: "",
    category: "kayu",
    condition: "bagus",
    qty: 1,
    unit: "pcs",
    notes: "",
  });

  const offer = useMemo(() => {
    const base = categoryPrice[form.category] || 25000;
    const factor = conditionFactor[form.condition] || 0.75;
    return Math.round(base * factor * Number(form.qty || 1));
  }, [form.category, form.condition, form.qty]);

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
          Beli Barang Bekas
        </p>
        <h1 className="text-3xl font-bold text-gray-800">Jual Barang Bekas ke Toko Kami</h1>
        <p className="mt-2 text-gray-600">
          Customer dapat menjual barang bekas ke toko, lalu kami akan menilai dan memberikan harga pembelian langsung sesuai kondisi dan jenis barang.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
          <div>
            <label className="block font-medium mb-1">Nama Anda</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Contoh: Agus Setiawan"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Nomor HP</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="08xxxxxxxxxx"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Nama Barang</label>
            <input
              type="text"
              name="itemName"
              value={form.itemName}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Contoh: Lemari kayu, kaca, besi, elektronik"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Kategori</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="kayu">Kayu</option>
                <option value="plastik">Plastik</option>
                <option value="kaca">Kaca</option>
                <option value="besi">Besi</option>
                <option value="tekstil">Tekstil</option>
                <option value="elektronik">Elektronik</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Kondisi</label>
              <select
                name="condition"
                value={form.condition}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="bagus">Bagus</option>
                <option value="layak">Layak Pakai</option>
                <option value="rusak">Rusak Ringan</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Jumlah</label>
              <input
                type="number"
                name="qty"
                min={form.unit === "kg" ? "0.1" : "1"}
                step={form.unit === "kg" ? "0.1" : "1"}
                value={form.qty}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Satuan</label>
              <select
                name="unit"
                value={form.unit}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="pcs">Pcs</option>
                <option value="kg">Kg</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Catatan</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows="4"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Ceritakan ukuran, warna, atau kondisi barang..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Ajukan Penjualan
          </button>
        </form>

        <aside className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Estimasi Harga Beli</h2>

          <div className="bg-white rounded-lg p-4 border">
            <p className="text-sm text-gray-500">Barang</p>
            <p className="font-semibold text-lg">{form.itemName || "Barang bekas"}</p>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <span>Kategori</span>
              <span className="font-medium capitalize">{form.category}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
              <span>Kondisi</span>
              <span className="font-medium capitalize">{form.condition}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
              <span>Jumlah</span>
              <span className="font-medium">{form.qty} {form.unit}</span>
            </div>
          </div>

          <div className="mt-5 rounded-lg bg-emerald-600 text-white p-4">
            <p className="text-sm uppercase tracking-wide">Harga tawaran kami</p>
            <p className="text-3xl font-bold mt-2">Rp{offer.toLocaleString("id-ID")}</p>
          </div>

          {submitted && (
            <div className="mt-5 border border-emerald-300 bg-white rounded-lg p-4 text-sm text-gray-700">
              <p className="font-semibold text-emerald-700">Permintaan penjualan berhasil dikirim.</p>
              <p className="mt-2">
                Tim kami akan menghubungi Anda di nomor {form.phone} untuk konfirmasi harga dan jadwal pengambilan ({form.qty} {form.unit}).
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
