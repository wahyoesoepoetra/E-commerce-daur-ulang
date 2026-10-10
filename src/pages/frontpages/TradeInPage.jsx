import { useMemo, useState } from "react";

const categoryValue = {
  kayu: 30000,
  kaca: 25000,
  plastik: 20000,
  tekstil: 22000,
  logam: 35000,
  lainnya: 18000,
};

const conditionFactor = {
  baik: 1,
  layak: 0.7,
  rusak: 0.4,
};

export default function TradeInPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    itemName: "",
    category: "kayu",
    condition: "baik",
    quantity: 1,
    notes: "",
  });

  const estimatedPrice = useMemo(() => {
    const base = categoryValue[form.category] || 20000;
    const factor = conditionFactor[form.condition] || 0.7;
    return Math.round(base * factor * Number(form.quantity || 1));
  }, [form.category, form.condition, form.quantity]);

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
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-green-600">
          Trade-In Barang Bekas
        </p>
        <h1 className="text-3xl font-bold text-gray-800">Tukarkan Barang Bekas Anda</h1>
        <p className="mt-2 text-gray-600">
          Kirim barang bekas Anda ke toko kami, lalu kami akan menilai dan memberikan estimasi harga yang bisa dipotong dari pembelian produk kami.
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
              placeholder="Contoh: Siti Rahma"
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
            <label className="block font-medium mb-1">Nama Barang Bekas</label>
            <input
              type="text"
              name="itemName"
              value={form.itemName}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Contoh: Botol kaca, kayu, kain, kaleng"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Jenis Barang</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="kayu">Kayu</option>
                <option value="kaca">Kaca</option>
                <option value="plastik">Plastik</option>
                <option value="tekstil">Tekstil</option>
                <option value="logam">Logam</option>
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
                <option value="baik">Baik</option>
                <option value="layak">Layak Pakai</option>
                <option value="rusak">Rusak Ringan</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Jumlah</label>
            <input
              type="number"
              name="quantity"
              min="1"
              value={form.quantity}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Catatan Tambahan</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows="4"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Ceritakan kondisi, ukuran, atau catatan lain..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Ajukan Penilaian
          </button>
        </form>

        <aside className="bg-green-50 border border-green-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Estimasi Nilai</h2>
          <div className="bg-white rounded-lg p-4 border">
            <p className="text-sm text-gray-500">Jenis</p>
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
              <span className="font-medium">{form.quantity}</span>
            </div>
          </div>

          <div className="mt-5 rounded-lg bg-green-600 text-white p-4">
            <p className="text-sm uppercase tracking-wide">Nilai estimasi</p>
            <p className="text-3xl font-bold mt-2">Rp{estimatedPrice.toLocaleString("id-ID")}</p>
          </div>

          {submitted && (
            <div className="mt-5 border border-green-300 bg-white rounded-lg p-4 text-sm text-gray-700">
              <p className="font-semibold text-green-700">Permintaan berhasil dikirim.</p>
              <p className="mt-2">
                Kami akan mengecek barang Anda dan menghubungi melalui nomor {form.phone}.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
