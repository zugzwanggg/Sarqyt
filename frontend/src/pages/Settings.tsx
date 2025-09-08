import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useState } from "react";
import type { IShop } from "../types";
import YandexSelectAddressMap from "../components/YandexSelectAddressMap";

const SettingsPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [shop, setShop] = useState<IShop>({
    id: 1,
    name: "My Awesome Shop",
    image_url:
      "https://www.healthbenefitstimes.com/glossary/wp-content/uploads/2020/07/Mustard.jpg",
    rating: 4.5,
    address: "123 Main Street, Atyrau",
    lat: 47.0945,
    lng: 51.9238,
  });

  const [previewImage, setPreviewImage] = useState(shop.image_url);
  const [isSelectLocation, setIsSelectLocation] = useState(false);

  const handleChange = (field: keyof IShop, value: string) => {
    setShop((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    }
  };

  const handleSave = () => {
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

      {/* If selecting location → show map */}
      {isSelectLocation ? (
        <div className="bg-white p-4 rounded-2xl shadow space-y-4">
          <h3 className="font-semibold text-md">Select Shop Location</h3>
          <YandexSelectAddressMap
            initialCoords={[shop.lat, shop.lng]}
            onSelect={(coords, addr) => {
              setShop((prev) => ({
                ...prev,
                lat: coords[0],
                lng: coords[1],
                address: addr,
              }));
            }}
          />
          <button
            onClick={() => setIsSelectLocation(false)}
            className="bg-primaryColor text-white w-full py-2 rounded-md"
          >
            Save Location
          </button>
        </div>
      ) : (
        <>
          {/* Shop Info */}
          {user?.role === "seller" && (
            <section className="bg-white shadow rounded-2xl p-4 space-y-4">
              <h3 className="text-md font-semibold">Shop Information</h3>

              {/* Shop Image */}
              <div className="flex flex-col items-center space-y-3">
                <img
                  src={previewImage}
                  alt="Shop"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
                <label className="text-sm text-primaryColor cursor-pointer underline">
                  Change Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              {/* Shop Name */}
              <div>
                <label className="block text-sm text-gray-600">Shop Name</label>
                <input
                  type="text"
                  value={shop.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="border rounded-md w-full px-3 py-2"
                />
              </div>

              {/* Shop Address */}
              <div>
                <span className="block text-sm text-gray-600">Address</span>
                <p className="text-gray-800">{shop.address}</p>
                <button
                  onClick={() => setIsSelectLocation(true)}
                  className="text-primaryColor text-sm underline"
                >
                  Change Location
                </button>
              </div>

              {/* Read-only Rating */}
              <div>
                <span className="block text-sm text-gray-600">Rating</span>
                <p className="text-gray-800 font-medium">{shop.rating} ★</p>
              </div>

              <button
                onClick={handleSave}
                className="bg-primaryColor text-white w-full py-2 rounded-md"
              >
                Save Changes
              </button>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default SettingsPage;