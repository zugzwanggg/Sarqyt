import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useState } from "react";
import type { IShop } from "../types";

const SettingsPage = () => {
  const { user, setIsSelectLocation } = useUser();
  const navigate = useNavigate();

  // Mock shop data (later fetch from backend)
  const [shop, setShop] = useState<IShop>({
    id: 1,
    name: "My Awesome Shop",
    image_url: "/shop.jpg",
    rating: 4.5,
    address: "123 Main Street, Atyrau",
  });

  const handleChange = (field: keyof IShop, value: string | number) => {
    setShop((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // TODO: send updated shop data to backend API
    console.log("Updated shop:", shop);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Go Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 mb-4"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* Shop Profile (only for sellers) */}
      {user?.role === "seller" && (
        <section className="bg-white shadow rounded-2xl p-4 space-y-3">
          <h3 className="text-md font-semibold mb-3">Shop Information</h3>

          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600">Shop Name</label>
              <input
                type="text"
                value={shop.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="border rounded-md w-full px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600">Address</label>
              <input
                type="text"
                value={shop.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="border rounded-md w-full px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600">Shop Image</label>
              <input
                type="text"
                value={shop.image_url}
                onChange={(e) => handleChange("image_url", e.target.value)}
                className="border rounded-md w-full px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600">Rating</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={shop.rating}
                onChange={(e) => handleChange("rating", Number(e.target.value))}
                className="border rounded-md w-full px-3 py-2"
              />
            </div>

            <button
              onClick={handleSave}
              className="bg-primaryColor text-white w-full py-2 rounded-md"
            >
              Save Changes
            </button>
          </div>
        </section>
      )}

      {/* Profile Section */}
      <section className="bg-white shadow rounded-2xl p-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-primaryColor">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-semibold">{user?.username}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className="bg-white shadow rounded-2xl p-4 space-y-3">
        <h3 className="text-md font-semibold">Information</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Location</span>
            <button
              onClick={() => setIsSelectLocation(true)}
              className="text-primaryColor text-sm underline"
            >
              {user?.city_name || "Set Location"}
            </button>
          </div>
        </div>
      </section>

      {/* Language Section */}
      <section className="bg-white shadow rounded-2xl p-4 space-y-3">
        <h3 className="text-md font-semibold">Language</h3>
        <select className="border rounded-md px-3 py-2 w-full">
          <option>English</option>
          <option>Русский</option>
          <option>Қазақша</option>
        </select>
      </section>

      {user?.role !== "seller" && (
        <section className="bg-white shadow rounded-2xl p-4">
          <h3 className="text-md font-semibold mb-2">Become a Seller</h3>
          <p className="text-sm text-gray-600 mb-3">
            Start selling your products and reach more customers.
          </p>
          <button className="bg-primaryColor text-white w-full py-2 rounded-md">
            Apply Now
          </button>
        </section>
      )}
    </div>
  );
};

export default SettingsPage;