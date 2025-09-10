import { useEffect, useState } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import type { IExtendedSarqytCard, IProduct } from "../types";
import { format } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import { getSellerProductById, getSellerProductSarqyts } from "../api/seller";

export default function ProductDetailsPage() {

  const {shopId, productId} = useParams();

  const navigate = useNavigate();
  const [sarqyts, setSarqyts] = useState<IExtendedSarqytCard[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [product, setProduct] = useState<IProduct|null>(null);


  const fetchProduct =async () => {
    try {
      
      const data = await getSellerProductById(shopId!, productId!);
      setProduct(data);

    } catch (error) {
      console.log(error);
    }
  }

  const fetchSarqyts =async () => {
    try {
      const data = await getSellerProductSarqyts(shopId!, productId!);
      setSarqyts(data)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=> {
    fetchProduct();
    fetchSarqyts();
  }, [shopId, productId])

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header with Back Button */}
      <div className="relative">
        <img
          src={product?.image_url}
          alt={product?.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-b-2xl"></div>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
        >
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </button>
        <div className="absolute bottom-3 left-4 text-white">
          <h1 className="text-xl sm:text-2xl font-bold">{product?.title}</h1>
          <p className="text-sm text-gray-200">{product?.description}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {sarqyts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-500 mt-20">
            <img src="/empty-box.svg" alt="No sarqyts" className="w-36 h-36 mb-4 opacity-70" />
            <p className="text-lg font-medium">No sarqyts yet</p>
            <p className="text-sm">Add your first one below.</p>
          </div>
        ) : (
          sarqyts.map((s) => (
            <div
              key={s.id}
              className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-4 shadow-sm"
            >
              <p className="text-lg font-semibold text-primaryColor">
                {s.discounted_price}₸{" "}
                <span className="line-through text-gray-400 text-sm ml-1">
                  {s.original_price}₸
                </span>
              </p>
              <p className="text-sm text-gray-700">Quantity: {s.quantity_available}</p>
              <p className="text-sm text-gray-700">
                Pickup:{" "}
                {s?.pickup_start && s?.pickup_end
                  ? `${format(new Date(s.pickup_start), "HH:mm")} – ${format(
                      new Date(s.pickup_end),
                      "HH:mm"
                    )}`
                  : "Not set"}
              </p>
              <p className="text-sm text-gray-500">
                Available until: {format(new Date(s.available_until), "dd/MM/yyyy HH:mm")}
              </p>
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 bg-primaryColor text-white p-4 rounded-full shadow-lg hover:scale-105 transition"
      >
        <Plus className="w-5 h-5" />
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="bg-white w-full p-6 rounded-t-2xl shadow-lg">
            <h2 className="text-lg font-bold mb-4">Add Sarqyt</h2>

            <div className="space-y-3">
              <input
                type="number"
                placeholder="Original Price"
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-primaryColor outline-none"
              />
              <input
                type="number"
                placeholder="Discounted Price"
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-primaryColor outline-none"
              />
              <input
                type="number"
                placeholder="Quantity"
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-primaryColor outline-none"
              />
              <input
                type="time"
                placeholder="Pickup Start"
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-primaryColor outline-none"
              />
              <input
                type="time"
                placeholder="Pickup End"
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-primaryColor outline-none"
              />
              <input
                type="datetime-local"
                placeholder="Available Until"
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-primaryColor outline-none"
              />
            </div>

            <button
              onClick={() => setShowForm(false)}
              className="mt-4 bg-primaryColor text-white w-full py-2 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
