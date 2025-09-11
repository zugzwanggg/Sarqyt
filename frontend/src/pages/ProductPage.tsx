import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Plus,
  ChevronLeft,
  ChevronRight,
  PenLine,
} from "lucide-react";
import type { IExtendedSarqytCard, IProduct } from "../types";
import { format } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import {
  createSarqyt,
  getSellerProductById,
  getSellerProductSarqyts,
} from "../api/seller";

export default function ProductDetailsPage() {
  const { shopId, productId } = useParams();
  const navigate = useNavigate();

  const [sarqyts, setSarqyts] = useState<IExtendedSarqytCard[]>([]);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<IExtendedSarqytCard | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    original_price: "",
    discounted_price: "",
    quantity_available: "",
    pickup_start: "",
    pickup_end: "",
    available_until: "",
  });

  const fetchProduct = async () => {
    try {
      const data = await getSellerProductById(shopId!, productId!);
      setProduct(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSarqyts = async () => {
    try {
      const data = await getSellerProductSarqyts(shopId!, productId!);
      setSarqyts(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateSarqyt = async () => {
    setLoading(true);
    try {
      const payload = {
        productId: Number(productId),
        original_price: Number(formData.original_price),
        discounted_price: Number(formData.discounted_price),
        quantity_available: Number(formData.quantity_available),
        pickup_start: formData.pickup_start,
        pickup_end: formData.pickup_end,
        available_until: formData.available_until,
      };

      await createSarqyt(shopId!, payload);
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
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchSarqyts();
  }, [shopId, productId]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Product header */}
      <div className="relative">
        <img
          src={product?.image_url}
          alt={product?.title}
          className="w-full h-56 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white/90 hover:bg-white p-2 rounded-full shadow"
        >
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </button>

        <div className="absolute bottom-3 left-4 right-4">
          <div className="bg-white/90 backdrop-blur-md rounded-xl p-3 shadow">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              {product?.title}
            </h1>
            <p className="text-sm text-gray-600">{product?.description}</p>
          </div>
        </div>
      </div>

      {/* Sarqyts list */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {sarqyts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-500 mt-16">
            <p className="text-lg font-medium">No sarqyts yet</p>
            <p className="text-sm">Start by adding your first one.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sarqyts.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-xl p-4 shadow hover:shadow-md transition relative"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-lg font-semibold text-primaryColor">
                    {s.discounted_price}₸{" "}
                    <span className="line-through text-gray-400 text-sm ml-1">
                      {s.original_price}₸
                    </span>
                  </p>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      s.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {s.status === "active" ? "Active" : "Expired"}
                  </span>
                </div>
                <p className="text-sm text-gray-700">
                  Quantity left: {s.quantity_available}
                </p>
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
                  Available until:{" "}
                  {format(new Date(s.available_until), "dd/MM/yyyy HH:mm")}
                </p>

                {s.status === "active" && (
                  <button
                    onClick={() => setEditData(s)}
                    className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
                  >
                    <PenLine className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {sarqyts.length > 0 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-2 rounded border bg-white disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 bg-primaryColor text-white rounded text-sm">
              {page}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="p-2 rounded border bg-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Bottom add button */}
      <div className="fixed w-full bottom-0 border-t bg-white p-4">
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-primaryColor text-white py-3 rounded-xl font-semibold shadow hover:opacity-90 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add Sarqyt
        </button>
      </div>

      {/* Add Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-lg overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Add Sarqyt</h2>

            <div className="space-y-5">
              {/* Original Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Original Price
                </label>
                <input
                  type="number"
                  value={formData.original_price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      original_price: e.target.value,
                    })
                  }
                  placeholder="e.g. 2000"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primaryColor outline-none"
                />
              </div>

              {/* Discounted Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discounted Price
                </label>
                <input
                  type="number"
                  value={formData.discounted_price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discounted_price: e.target.value,
                    })
                  }
                  placeholder="e.g. 1200"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primaryColor outline-none"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  value={formData.quantity_available}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity_available: e.target.value,
                    })
                  }
                  placeholder="How many bags?"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primaryColor outline-none"
                />
              </div>

              {/* Pickup Times */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pickup Start
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.pickup_start}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pickup_start: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primaryColor outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pickup End
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.pickup_end}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pickup_end: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primaryColor outline-none"
                  />
                </div>
              </div>

              {/* Available Until */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Until
                </label>
                <input
                  type="datetime-local"
                  value={formData.available_until}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      available_until: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primaryColor outline-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSarqyt}
                disabled={loading}
                className="flex-1 py-2 rounded-lg bg-primaryColor text-white font-semibold shadow hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal (simplified for now) */}
      {editData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-lg overflow-y-auto max-h-[90vh]">
            <h2 className="text-lg font-bold mb-4">Edit Sarqyt</h2>

            <div className="space-y-3">
              <input
                type="number"
                defaultValue={editData.original_price}
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-primaryColor outline-none"
              />
              <input
                type="number"
                defaultValue={editData.discounted_price}
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-primaryColor outline-none"
              />
              <input
                type="number"
                defaultValue={editData.quantity_available}
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-primaryColor outline-none"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditData(null)}
                className="flex-1 py-2 rounded-lg border border-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => setEditData(null)}
                className="flex-1 py-2 rounded-lg bg-primaryColor text-white font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
