import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import defaultProductImage from "../../assets/products/produk - 1.png";
import { apiRequest } from "../../utils/api";

export default function Dashboard() {
  const outletContext = useOutletContext();
  const searchTerm = outletContext?.searchTerm ?? "";
  const category = outletContext?.category ?? "Semua Kategori";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/products")
      .then((result) => {
        if (!Array.isArray(result?.data)) {
          throw new Error("Format data produk dari Laravel tidak valid.");
        }

        const apiProducts = result.data.map((product) => ({
          id: product.product_id,
          name: product.name,
          slug: product.slug,
          price: Number(product.price),
          stock: product.stock,
          category: product.category_id,
          category_name: product.category,
          material: product.category ?? "",
          description: product.description ?? "",
          img: product.img || defaultProductImage,
        }));

        setProducts(apiProducts);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    const matchesSearch = !normalizedSearchTerm || [
      product.name,
      product.material,
      product.description,
    ].some((value) => value.toLowerCase().includes(normalizedSearchTerm));

    const matchesCategory =
      category === "Semua Kategori" || product.category_name === category;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <p className="text-center">Memuat produk...</p>;
  }

  if (error) {
    return <p role="alert" className="text-center text-red-600">{error}</p>;
  }

  return (
    <div>
      {filteredProducts.length === 0 && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-center text-amber-800"
        >
          Tidak ditemukan
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} p={product} />
        ))}
      </div>
    </div>
  );
}