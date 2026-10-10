import { useOutletContext } from "react-router-dom";
import { products } from "../../utils/data";
import ProductCard from "../../components/ProductCard";
 
export default function Dashboard() { 
  const outletContext = useOutletContext();
  const searchTerm = outletContext?.searchTerm ?? "";
  const category = outletContext?.category ?? "Semua Kategori";
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    const matchesSearch = !normalizedSearchTerm || [
      product.name,
      product.material,
      product.description,
    ].some((value) => value.toLowerCase().includes(normalizedSearchTerm));
    const matchesCategory = category === "Semua Kategori" || product.category_name === category;

    return matchesSearch && matchesCategory;
  });

  return ( 
    <div> 
      {filteredProducts.length === 0 && (normalizedSearchTerm || category !== "Semua Kategori") && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-center text-amber-800"
        >
          Tidak ditemukan
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"> 
        {/* {[1, 2, 3].map((id) => ( 

          //salin blok kode ini dan pindahkan ke product card
          <div key={id} className="border rounded-lg p-4 shadow hover:shadow-lg"> 
            <h2 className="font-semibold">Produk {id}</h2> 
            <p className="text-gray-600">Deskripsi singkat produk {id}</p> 
            <Link 
              to={`/product/${id}`} 
              className="text-blue-600 hover:underline mt-2 block" 
            > 
              Lihat Detail
            </Link> 
          </div>

        ))}  */}

      {/* blok kode di atas bisa diedit menjadi berikut */}
        {filteredProducts.map((item) => (
          //p adalah props untuk mengirim data produk ke komponen ProductCard
          <ProductCard key={item.id} p={item} />
        ))}
      </div> 
    </div> 
  ); 
} 
