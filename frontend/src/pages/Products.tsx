import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import ProductCard from "../components/ProductCard";
import type { IProduct } from "../types";
import { useUser } from "../context/UserContext";
import { getSellerProducts } from "../api/seller";

export default function ProductsPage() {
  const { user } = useUser();
  const [products, setProducts] = useState<IProduct[]>([]);

  const fetchProducts = async () => {
    try {
      const data = await getSellerProducts(user?.shop_id);
      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="py-8 px-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shop Products</h1>
          <p className="text-sm text-gray-500">Manage and organize your shop’s products</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primaryColor text-white shadow-lg hover:opacity-90 transition">
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center text-gray-500 mt-24">
          <img
            src="/empty-box.svg"
            alt="No products"
            className="w-48 h-48 mb-6 opacity-70"
          />
          <h2 className="text-lg font-semibold">No products yet</h2>
          <p className="text-sm">Start by adding your first product to showcase here.</p>
          <button className="mt-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-primaryColor text-white shadow-md hover:opacity-90 transition">
            <Plus size={18} /> Add Product
          </button>
        </div>
      )}
    </div>
  );
}