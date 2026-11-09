import { buyBackRequests, recycledStock } from "../../data/adminData";

export default function AdminDashboard() {
  const totalRequests = buyBackRequests.length;
  const approved = buyBackRequests.filter((item) => item.status === "Disetujui").length;
  const pending = buyBackRequests.filter((item) => item.status === "Menunggu").length;
  const totalStock = recycledStock.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Kelola pembelian barang bekas dan stok bahan daur ulang</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 border">
          <p className="text-sm text-gray-500">Total Permintaan</p>
          <p className="text-3xl font-bold mt-2 text-emerald-700">{totalRequests}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border">
          <p className="text-sm text-gray-500">Disetujui</p>
          <p className="text-3xl font-bold mt-2 text-blue-700">{approved}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border">
          <p className="text-sm text-gray-500">Menunggu</p>
          <p className="text-3xl font-bold mt-2 text-orange-600">{pending}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border">
          <p className="text-sm text-gray-500">Stok Daur Ulang</p>
          <p className="text-3xl font-bold mt-2 text-purple-700">{totalStock}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-xl shadow-sm border p-5">
          <h2 className="text-xl font-bold mb-4">Permintaan Beli Barang Bekas</h2>
          <div className="space-y-3">
            {buyBackRequests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <p className="font-semibold">{request.customer}</p>
                    <p className="text-sm text-gray-600">{request.itemName} · {request.category}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                    {request.status}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 text-sm text-gray-600">
                  <div>
                    <p className="text-xs uppercase">Kondisi</p>
                    <p className="font-medium">{request.condition}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase">Jumlah</p>
                    <p className="font-medium">{request.qty}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase">Tawaran</p>
                    <p className="font-medium">Rp{request.offer.toLocaleString("id-ID")}</p>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">
                    Setujui
                  </button>
                  <button className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600">
                    Tolak
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm border p-5">
          <h2 className="text-xl font-bold mb-4">Stok Bahan Daur Ulang</h2>
          <div className="space-y-3">
            {recycledStock.map((item) => (
              <div key={item.id} className="flex items-center justify-between border rounded-lg p-3">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.category} · {item.material}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Stok</p>
                  <p className="font-bold text-lg">{item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}