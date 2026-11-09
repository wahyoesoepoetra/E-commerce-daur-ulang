import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    payment: "Transfer Bank",
  });
  const [submitted, setSubmitted] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto p-6 text-center text-gray-600">
        <p className="text-xl font-semibold mb-2">Keranjang masih kosong</p>
        <p>Silakan pilih produk terlebih dahulu sebelum checkout.</p>
      </div>
    );
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = 25000;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    clearCart();
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <Link to="/cart" className="text-emerald-700 hover:underline">
          Kembali ke Keranjang
        </Link>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
          <p className="text-2xl font-bold text-emerald-700 mb-2">Pesanan Berhasil Dikonfirmasi</p>
          <p className="text-gray-700">
            Terima kasih, {form.name || "pelanggan"}. Pesanan Anda sedang diproses dan akan segera dikirim.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
            <div>
              <label className="block font-medium mb-1">Nama Pembeli</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Alamat Pengiriman</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows="3"
                className="w-full border rounded-lg px-3 py-2"
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
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Metode Pembayaran</label>
              <select
                name="payment"
                value={form.payment}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option>Transfer Bank</option>
                <option>E-Wallet</option>
                <option>COD</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg"
            >
              Konfirmasi Pesanan
            </button>
          </form>

          <aside className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Ringkasan Pesanan</h2>

            <div className="space-y-3 mb-5">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-gray-700">
                  <span>
                    {item.name} x {item.qty}
                  </span>
                  <span>Rp{(item.price * item.qty).toLocaleString("id-ID")}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rp{subtotal.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between">
                <span>Ongkir</span>
                <span>Rp{shipping.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-emerald-700">
                <span>Total</span>
                <span>Rp{total.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
