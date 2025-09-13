import { ChevronLeft, MapPin, Cake } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import ShopSarqytCard from "../components/ShopSarqytCard";
import { useState, useEffect } from "react";
import type { IShop, IShopSarqytCard } from "../types";
import { getShopById, getShopSarqytsByShopId } from "../api/shop";
import YandexSellerMap from "../components/YandexSellerMap";
import { useTranslation } from "react-i18next";

const Shop = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { t } = useTranslation();

  const [shop, setShop] = useState<IShop | null>(null);
  const [sarqyts, setSarqyts] = useState<IShopSarqytCard[]>([]);

  const getShop = async () => {
    try {
      const data = await getShopById(id!);
      setShop(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getShopSarqyts = async () => {
    try {
      const data = await getShopSarqytsByShopId(id!);
      setSarqyts(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getShop();
    getShopSarqyts();
  }, [id]);

  return (
    <div className="bg-lightGrayColor min-h-screen">
      {/* Hero Header */}
      <div className="relative">
        <img
          src={shop?.image_url}
          alt={shop?.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button
          onClick={() => nav(-1)}
          className="absolute top-4 left-4 bg-white rounded-full p-2 shadow"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="absolute bottom-4 left-4 text-white">
          <h1 className="text-2xl font-bold">{shop?.name}</h1>
          <div className="flex items-center gap-2 text-sm opacity-90">
            <MapPin size={14} />
            <span>{shop?.address}</span>
          </div>
        </div>
      </div>

      {/* Sarqyts Section */}
      <div className="p-4 bg-white mt-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">{t("Sarqyts from this store")}</h2>
        </div>

        {sarqyts.length > 0 ? (
          <div className="pb-2">
            {sarqyts.map((item) => (
              <ShopSarqytCard key={item.id} {...item} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            {t("No sarqyts available yet.")}
          </p>
        )}
      </div>

      {/* Stats / About */}
      <div className="p-4 my-3 bg-white rounded-t-2xl">
        <h2 className="mb-4 font-semibold text-lg">{t("About this shop")}</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center p-3 bg-lightGrayColor rounded-xl">
            <Cake className="text-primaryColor" />
            <span className="font-bold">5 {t("yrs")}</span>
            <p className="text-xs text-gray-500">{t("Active")}</p>
          </div>

          <div className="flex flex-col items-center p-3 bg-lightGrayColor rounded-xl">
            <Cake className="text-green-600" />
            <span className="font-bold">1,000+</span>
            <p className="text-xs text-gray-500">{t("Meals Saved")}</p>
          </div>
        </div>
      </div>

      <YandexSellerMap lat={shop?.lat} lng={shop?.lng} logo={shop?.image_url} />
    </div>
  );
};

export default Shop;
