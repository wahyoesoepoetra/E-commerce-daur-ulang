import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard ({p}){
    //gunakan useCart disini
    const {addToCart} = useCart();
    const isAvailable = p.stock > 0;

    return (
        <div key={p.id} className="h-full border rounded-lg p-4 shadow hover:shadow-lg overflow-hidden flex flex-col">
            <img
                src={p.img}
                alt={p.name}
                className="w-full h-40 object-cover rounded-md mb-3"
            />
            <h2 className="font-semibold min-h-12">{p.name}</h2>
            <p className="text-gray-600">Rp{p.price.toLocaleString()}</p>
            <p className={isAvailable ? "text-sm text-emerald-700" : "text-sm text-rose-700"}>
                {isAvailable ? `Tersedia (${p.stock} stok)` : "Produk belum tersedia"}
            </p>

            <Link
              to={`/product/${p.slug}`}
              state={p}
              className="text-emerald-700 hover:text-emerald-900 hover:underline mt-2 block"
            >
              Lihat Detail
            </Link>

            <button
                onClick={() => addToCart(p)}
                disabled={!isAvailable}
                className="mt-auto self-start px-3 py-1.5 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-400 flex items-center gap-2"
            >
                {isAvailable ? "Add to Cart" : "Stok Habis"}
            </button>
        </div>
    );
}
