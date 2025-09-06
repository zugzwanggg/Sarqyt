import { useState } from "react";
import { Plus } from "lucide-react";
import ProductCard from "../components/ProductCard";
import type { IProduct } from "../types";

export default function ProductsPage() {
  const [products] = useState<IProduct[]>([
    { id: 1, shop_id: 1, title: "Bakery Surprise Bag",  image_url: "/bakery.jpg", description: '' },
    { id: 2, shop_id: 1, title: "Sushi Surprise Box",  image_url: "/sushi.jpg", description: '' },
    { id: 3, shop_id: 1, title: "Pizza Night Box", image_url: "/pizza.jpg", description: '' },
  ]);

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Shop Products</h1>
        <button
          className="flex items-center gap-2 px-4 text-sm py-2 rounded-2xl bg-primaryColor text-white shadow-md hover:opacity-90"
        >
          <Plus /> Add Product
        </button>
      </div>

      
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product}/>
        ))}
      </div>
    </div>
  );
}
