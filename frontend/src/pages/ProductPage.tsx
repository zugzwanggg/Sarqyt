import { useState } from "react";
import { Plus } from "lucide-react";
import type { IExtendedSarqytCard } from "../types";
import { format } from "date-fns";


export default function ProductDetailsPage() {
  const [sarqyts] = useState<IExtendedSarqytCard[]>([]);
  const [showForm, setShowForm] = useState(false);

  const product = {
    title: "Bakery Surprise Box",
    description: "Fresh pastries and bread",
    image_url: "https://placehold.co/600x400",
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="p-4">
        <img
          src={product.image_url}
          alt={product.title}
          className="w-full h-40 object-cover rounded-2xl"
        />
        <h1 className="text-xl font-bold mt-2">{product.title}</h1>
        <p className="text-gray-600 text-sm">{product.description}</p>
      </div>

      {/* Sarqyts List */}
      <div className="flex-1 overflow-y-auto px-4">
        {sarqyts.length === 0 ? (
          <p className="text-gray-500 text-sm">No sarqyts yet. Add one below.</p>
        ) : (
          sarqyts.map((s) => (
            <div
              key={s.id}
              className="bg-gray-100 rounded-2xl p-4 mb-3 shadow-sm"
            >
              <p className="font-semibold">
                {s.discounted_price}₸{" "}
                <span className="line-through text-gray-400 text-sm ml-1">
                  {s.original_price}₸
                </span>
              </p>
              <p className="text-sm">Quantity: {s.quantity_available}</p>
              <p className="text-sm">
                Pickup: {s?.pickup_start && s?.pickup_end 
                  ? `${format(new Date(s.pickup_start), "HH:mm")}–${format(new Date(s.pickup_end), "HH:mm")}`
                  : "Time not available"
                }
              </p>
              <p className="text-sm text-gray-600">
                Available until: {format(new Date(s.available_until), "dd/MM/yyyy HH:mm")}
              </p>
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 bg-primaryColor text-white p-4 rounded-full shadow-lg"
      >
        <Plus className="w-5 h-5" />
      </button>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="bg-white w-full p-6 rounded-t-2xl">
            <h2 className="text-lg font-bold mb-4">Add Sarqyt</h2>

            <input
              type="number"
              placeholder="Original Price"
              className="w-full border p-2 rounded mb-2"
            />
            <input
              type="number"
              placeholder="Discounted Price"
              className="w-full border p-2 rounded mb-2"
            />
            <input
              type="number"
              placeholder="Quantity"
              className="w-full border p-2 rounded mb-2"
            />
            <input
              type="time"
              placeholder="Pickup Start"
              className="w-full border p-2 rounded mb-2"
            />
            <input
              type="time"
              placeholder="Pickup End"
              className="w-full border p-2 rounded mb-2"
            />
            <input
              type="datetime-local"
              placeholder="Available Until"
              className="w-full border p-2 rounded mb-4"
            />

            <button
              onClick={() => setShowForm(false)}
              className="bg-primaryColor text-white w-full py-2 rounded-lg font-semibold"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
