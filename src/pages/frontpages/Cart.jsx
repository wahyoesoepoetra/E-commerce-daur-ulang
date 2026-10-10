import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function Cart() {
  const { cart, updateQty, removeFromCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="p-6 text-center text-gray-600">
        <p className="text-xl font-semibold mb-2">Keranjang masih kosong</p>
        <p>Silakan pilih produk terlebih dahulu.</p>
      </div>
    );
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Keranjang Belanja</h1>
        <Link
          to="/checkout"
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          Lanjut ke Checkout
        </Link>
      </div>

      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border p-4 rounded-lg shadow-sm bg-white"
          >
            <div className="flex items-center gap-4">
              <img src={item.img} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-gray-600">Rp{item.price.toLocaleString("id-ID")}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                value={item.qty}
                min="1"
                className="w-16 border rounded text-center"
                onChange={(e) => updateQty(item.id, parseInt(e.target.value))}
              />
              <button
                onClick={() => removeFromCart(item.id)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Subtotal</span>
          <span className="text-xl font-bold text-emerald-700">
            Rp{subtotal.toLocaleString("id-ID")}
          </span>
        </div>
      </div>
    </div>
  );
}