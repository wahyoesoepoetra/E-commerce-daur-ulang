import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { products } from "../../utils/data";

export default function ProductDetail() { 
  const { id } = useParams();
  const location = useLocation();
  const p = location.state || products.find((product) => product.slug === id) || {};

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, sender: "seller", text: "Halo, ada yang ingin ditanyakan tentang produk ini?" },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating || !review.trim()) return;

    const newReview = {
      id: Date.now(),
      rating,
      review,
    };
    setReviews([...reviews, newReview]);
    setRating(0);
    setReview("");
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    setMessages((currentMessages) => [
      ...currentMessages,
      { id: Date.now(), sender: "buyer", text: chatMessage.trim() },
      {
        id: Date.now() + 1,
        sender: "seller",
        text: "Terima kasih, pesan Anda sudah diterima. Penjual akan segera membalas.",
      },
    ]);
    setChatMessage("");
  };

  if (!p || !p.name) {
    return <div className="p-6 text-gray-600">Produk tidak ditemukan.</div>;
  }

  return (
    <div className="p-6">
      <div className="flex gap-6 items-start">
        <section className="flex-1 space-y-6">
          <div className="border border-gray-400 rounded-lg p-4">
            <img
              src={p.img}
              alt={p.name}
              className="w-full h-80 object-cover rounded-md mb-4"
            />
            <h1 className="text-xl font-bold">{p.name}</h1>
            <p className="mt-2">Rp{p.price?.toLocaleString?.() ?? p.price}</p>
            <p className={p.stock > 0 ? "mt-2 text-sm text-emerald-700" : "mt-2 text-sm text-rose-700"}>
              {p.stock > 0 ? `Tersedia (${p.stock} stok)` : "Produk belum tersedia atau stok habis."}
            </p>
            <button
              type="button"
              onClick={() => setChatOpen((isOpen) => !isOpen)}
              className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium"
            >
              {chatOpen ? "Tutup Chat" : "Chat Penjual"}
            </button>
          </div>

          {/* Bagian Daftar Review Pengguna */}
          <div>
            <h2 className="text-lg font-bold mb-3">User Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-gray-500">Belum ada review.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="border border-gray-400 rounded-lg p-4 bg-white"
                  >
                    <div className="flex items-center gap-1 mb-2">
                      {/* Menampilkan bintang sesuai rating */}
                      {[...Array(r.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-500 text-lg">
                          ★
                        </span>
                      ))}
                      {[...Array(5 - r.rating)].map((_, i) => (
                        <span key={i} className="text-gray-300 text-lg">
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-800">{r.review}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Bagian Kanan: Form Input Review */}
        <section className="w-80 border border-gray-400 rounded-lg p-4">
          {chatOpen && (
            <div className="mb-6 border border-emerald-200 rounded-lg overflow-hidden">
              <div className="bg-emerald-50 px-4 py-3 border-b border-emerald-200">
                <h2 className="font-bold text-emerald-800">Chat Penjual</h2>
                <p className="text-xs text-gray-600 mt-1">Tanyakan detail produk sebelum membeli.</p>
              </div>

              <div className="p-3 space-y-2 max-h-56 overflow-y-auto bg-white">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "buyer" ? "justify-end" : "justify-start"}`}
                  >
                    <p
                      className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                        message.sender === "buyer"
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {message.text}
                    </p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleChatSubmit} className="flex gap-2 p-3 border-t bg-gray-50">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Tulis pesan..."
                  className="min-w-0 flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm"
                >
                  Kirim
                </button>
              </form>
            </div>
          )}

          <h2 className="text-lg font-bold mb-3">Reviews</h2>
          
          {/* Form Rating & Review */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block font-bold mb-1">Rating:</label>
              <div className="flex gap-1 text-2xl mb-2">
                {/* Menampilkan 5 bintang untuk rating */}
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className={
                      star <= rating ? "text-yellow-500" : "text-gray-300"
                    }
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block font-bold mb-1">Review:</label>
              {/* Textarea untuk review */}
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full border border-gray-400 rounded-lg p-3 text-sm focus:outline-none"
                rows="4"
                placeholder="Tulis pengalaman Anda..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
            >
              Submit
            </button>
          </form>
        </section>
      </div>
    </div>
  ); 
}
