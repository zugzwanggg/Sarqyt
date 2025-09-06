import { useState } from "react";
import { Plus, Eye } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
}

export default function ProductsPage() {
  const [products] = useState<Product[]>([
    { id: 1, name: "Bakery Surprise Bag", price: 990, image: "/bakery.jpg" },
    { id: 2, name: "Sushi Surprise Box", price: 1500, image: "/sushi.jpg" },
    { id: 3, name: "Pizza Night Box", price: 2000, image: "/pizza.jpg" },
  ]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Shop Products</h1>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-primaryColor text-white shadow-md hover:opacity-90"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition"
          >
          
            <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400">No Image</span>
              )}
            </div>

            <div className="p-4">
              <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
              <p className="text-gray-600 mb-3">{product.price} ₸</p>

              <button
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-xl bg-gray-100 hover:bg-gray-200 transition"
              >
                <Eye size={16} />
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
