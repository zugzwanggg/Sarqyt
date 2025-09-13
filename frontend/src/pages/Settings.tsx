import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useEffect, useState } from "react";
import type { IShop } from "../types";
import YandexSelectAddressMap from "../components/YandexSelectAddressMap";
import { editShop } from "../api/shop";
import { getSellerShopData } from "../api/seller";
import { useTranslation } from "react-i18next";

const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const { user } = useUser();
  const navigate = useNavigate();

  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("lang") || i18n.language
  );

  const [shop, setShop] = useState<IShop>({
    id: 1,
    name: t("My Awesome Shop"),
    image_url:
      "https://www.healthbenefitstimes.com/glossary/wp-content/uploads/2020/07/Mustard.jpg",
    rating: 4.5,
    address: t("123 Main Street, Atyrau"),
    lat: 47.0945,
    lng: 51.9238,
  });

  const [previewImage, setPreviewImage] = useState(shop.image_url);
  const [shopLogo, setShopLogo] = useState<File | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);

  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, []);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setSelectedLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  const handleChange = (field: keyof IShop, value: string) => {
    setShop((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setShopLogo(file);
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", shop?.name);
    formData.append("address", shop?.address);
    formData.append("lat", shop?.lat.toString());
    formData.append("lng", shop?.lng.toString());
    if (shopLogo) formData.append("image", shopLogo);

    try {
      await editShop(formData, shop?.id);
      await getShopData();
    } catch (error) {
      console.log(error);
    }
  };

  const getShopData = async () => {
    try {
      const data = await getSellerShopData();
      setShop(data);
      setPreviewImage(data?.image_url);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user?.role === "seller") {
      getShopData();
    }
  }, []);

  return (
    <div className="p-4 space-y-6">
      {/* Go Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 mb-4"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm font-medium">{t("Back")}</span>
      </button>

      {/* Shop Profile */}
      {user?.role === "seller" && (
        <section className="bg-white shadow rounded-2xl p-4 space-y-4">
          <h3 className="text-md font-semibold">{t("Shop Information")}</h3>

          {/* Shop Image */}
          <div className="flex flex-col items-center space-y-3">
            <img
              src={previewImage}
              alt={shop.name}
              className="w-32 h-32 object-cover rounded-lg border"
            />
            <label className="text-sm text-primaryColor cursor-pointer underline">
              {t("Change Image")}
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
            <label className="block text-sm text-gray-600">{t("Shop Name")}</label>
            <input
              type="text"
              value={shop.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="border rounded-md w-full px-3 py-2"
            />
          </div>

          {/* Shop Address */}
          <div>
            <span className="block text-sm text-gray-600">{t("Address")}</span>
            <p className="text-gray-800">{shop.address}</p>
            <button
              onClick={() => setIsMapOpen(true)}
              className="text-primaryColor text-sm underline"
            >
              {t("Change Location")}
            </button>
          </div>

          {/* Read-only Rating */}
          <div>
            <span className="block text-sm text-gray-600">{t("Rating")}</span>
            <p className="text-gray-800 font-medium">{shop.rating} ★</p>
          </div>

          <button
            onClick={handleSave}
            className="bg-primaryColor text-white w-full py-2 rounded-md"
          >
            {t("Save Changes")}
          </button>
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

      {/* Language Section */}
      <section className="bg-white shadow rounded-2xl p-4 space-y-3">
        <h3 className="text-md font-semibold">{t("Language")}</h3>
        <select
          value={selectedLanguage}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="border rounded-md px-3 py-2 w-full"
        >
          <option value="en">English</option>
          <option value="ru">Русский</option>
          <option value="kk">Қазақша</option>
        </select>
      </section>

      {/* Map Overlay */}
      {isMapOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-2xl shadow w-full max-w-2xl space-y-4">
            <h3 className="font-semibold text-md">{t("Select Shop Location")}</h3>
            <YandexSelectAddressMap
              onClose={() => setIsMapOpen(false)}
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
              onClick={() => setIsMapOpen(false)}
              className="bg-primaryColor text-white w-full py-2 rounded-md"
            >
              {t("Save Location")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
