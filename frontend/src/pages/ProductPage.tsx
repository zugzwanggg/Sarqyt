import { useEffect, useState } from "react";
import { createSarqyt, getSellerProductSarqyts } from "../api/seller"; 
import { Plus, X } from "lucide-react";

type Sarqyt = {
  id: number;
  product_id: number;
  original_price: number;
  discounted_price: number;
  quantity_available: number;
  pickup_start: string;
  pickup_end: string;
  available_until: string;
};

type Props = {
  shopId: string;
  productId: number;
};

export default function SarqytsPage({ shopId, productId }: Props) {
  const [sarqyts, setSarqyts] = useState<Sarqyt[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    original_price: "",
    discounted_price: "",
    quantity_available: "",
    pickup_start: "",
    pickup_end: "",
    available_until: "",
  });

  const fetchSarqyts = async () => {
    try {
      const res = await getSellerProductSarqyts(shopId, productId);
      setSarqyts(res);
    } catch (error) {
      console.error("Error fetching sarqyts:", error);
    }
  };

  useEffect(() => {
    fetchSarqyts();
  }, []);

  const handleCreateSarqyt = async () => {
    setLoading(true);
    try {
      await createSarqyt(shopId, {
        productId,
        ...formData,
      });

      setShowForm(false);
      setFormData({
        original_price: "",
        discounted_price: "",
        quantity_available: "",
        pickup_start: "",
        pickup_end: "",
        available_until: "",
      });

      await fetchSarqyts();
    } catch (error) {
      console.error("Error creating sarqyt:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Sarqyts</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-primaryColor text-white px-4 py-2 rounded-lg shadow hover:opacity-90"
        >
          <Plus size={18} /> Add Sarqyt
        </button>
      </div>

      {sarqyts.length === 0 ? (
        <p className="text-gray-500">No sarqyts yet.</p>
      ) : (
        <div className="grid gap-4">
          {sarqyts.map((s) => (
            <div
              key={s.id}
              className="border p-4 rounded-lg shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">#{s.id}</p>
                <p>
                  {s.discounted_price}₸ /{" "}
                  <span className="line-through text-gray-400">
                    {s.original_price}₸
                  </span>
                </p>
                <p>Available: {s.quantity_available}</p>
              </div>
              <div className="text-sm text-gray-600">
                <p>Pickup: {s.pickup_start} - {s.pickup_end}</p>
                <p>Until: {s.available_until}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-semibold mb-4">Add Sarqyt</h3>

            <div className="space-y-3">
              <input
                type="number"
                placeholder="Original Price"
                value={formData.original_price}
                onChange={(e) =>
                  setFormData({ ...formData, original_price: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 outline-none"
              />

              <input
                type="number"
                placeholder="Discounted Price"
                value={formData.discounted_price}
                onChange={(e) =>
                  setFormData({ ...formData, discounted_price: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 outline-none"
              />

              <input
                type="number"
                placeholder="Quantity Available"
                value={formData.quantity_available}
                onChange={(e) =>
                  setFormData({ ...formData, quantity_available: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 outline-none"
              />

              <input
                type="datetime-local"
                value={formData.pickup_start}
                onChange={(e) =>
                  setFormData({ ...formData, pickup_start: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 outline-none"
              />

              <input
                type="datetime-local"
                value={formData.pickup_end}
                onChange={(e) =>
                  setFormData({ ...formData, pickup_end: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 outline-none"
              />

              <input
                type="datetime-local"
                value={formData.available_until}
                onChange={(e) =>
                  setFormData({ ...formData, available_until: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 outline-none"
              />
            </div>

            <button
              onClick={handleCreateSarqyt}
              disabled={loading}
              className="mt-4 bg-primaryColor text-white w-full py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Sarqyt"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
