import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import ProductCard from "../components/ProductCard";
import type { IProduct } from "../types";
import { useUser } from "../context/UserContext";
import { getSellerProducts } from "../api/seller";

export default function ProductsPage() {
  const {user} = useUser();
  const [products, setProducts] = useState<IProduct[]>([]);

  const fetchProducts =async () => {
    try {

      const data = await getSellerProducts(user?.shop_id)
      setProducts(data);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=> {
    fetchProducts();
  }, [])

  return (
    <div className="py-6 px-4 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Shop Products</h1>
        <button className="flex items-center gap-2 px-3 sm:px-4 text-sm py-2 rounded-xl bg-primaryColor text-white shadow-md hover:opacity-90">
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primaryColor outline-none"
        />
      </div>

      {products.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-500 mt-16">
          <img src="/empty-box.svg" alt="No products" className="w-40 h-40 mb-4 opacity-70" />
          <p className="text-lg font-medium">No products yet</p>
          <p className="text-sm">Start by adding your first product.</p>
        </div>
      )}
    </div>
  );
}