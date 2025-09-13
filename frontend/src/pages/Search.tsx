import { useEffect, useState } from "react";
import SarqytCard from "../components/SarqytCard";
import SearchBar from "../components/SearchBar";
import { getSarqyts } from "../api/sarqyt";
import type { ISarqytCard } from "../types";
import { search } from "../api/user";
import { SearchX } from "lucide-react";
import YandexAllShopsMap from "../components/YandexAllShopsMap"; 
import type { IShop } from "../types";
import { useTranslation } from "react-i18next";

export const dummyShops: IShop[] = [
  {
    id: 1,
    name: "Bakerist",
    image_url: "https://www.healthbenefitstimes.com/glossary/wp-content/uploads/2020/07/Mustard.jpg",
    rating: 4.7,
    address: "Isatay Taymanov Ave 58, Atyrau",
    lat: 47.1000,
    lng: 51.9200,
  },
  {
    id: 2,
    name: "Coffee Matters",
    image_url: "https://img.postershop.me/10397/Config/257652_1698210458.4511_original.png",
    rating: 4.5,
    address: "Satpayev Ave, Atyrau",
    lat: 47.1020,
    lng: 51.9500,
  },
  {
    id: 3,
    name: "Sulo Cafe & Bakery",
    image_url: "https://media-cdn.tripadvisor.com/media/photo-p/11/7a/5c/a6/photo0jpg.jpg",
    rating: 4.3,
    address: "Qanysh Satbaev Ave 36, Atyrau",
    lat: 47.0850,
    lng: 51.9300,
  },
  {
    id: 4,
    name: "Nan Cakes & Bakes",
    image_url: "https://www.thetncard.com/uploads/Cakes%20bakes%20banner.jpg",
    rating: 4.6,
    address: "Baqtygerey Qulmanov St 119а, Atyrau",
    lat: 47.1100,
    lng: 51.9400,
  },
  {
    id: 5,
    name: "Booblik",
    image_url: "https://media-cdn.tripadvisor.com/media/photo-s/0f/d9/18/53/photo0jpg.jpg",
    rating: 4.4,
    address: "Azattyq Avenue 17V, Atyrau",
    lat: 47.0950,
    lng: 51.9600,
  },
];

const Search = () => {
  const { t } = useTranslation();
  const [sarqyts, setSarqyts] = useState<ISarqytCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "map">("list");

  const getSarqytsData = async () => {
    try {
      setLoading(true);
      const data = await getSarqyts(null);
      setSarqyts(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    try {
      setLoading(true);
      const data = await search(query, "");
      setSarqyts(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (query: string, period: string) => {
    try {
      setLoading(true);
      const data = await search(query, period);
      setSarqyts(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSarqytsData();
  }, []);

  return (
    <div className="pb-10">
      <div className="sticky top-0 bg-white z-10 py-3 px-4">
        <SearchBar onSearch={handleSearch} onFilter={handleFilter} />

        <div className="flex gap-4 mt-3">
          <button
            className={`px-4 py-2 rounded-lg font-medium ${
              view === "list"
                ? "bg-primaryColor text-white"
                : "bg-gray-100 text-gray-600"
            }`}
            onClick={() => setView("list")}
          >
            {t("search.list")}
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium ${
              view === "map"
                ? "bg-primaryColor text-white"
                : "bg-gray-100 text-gray-600"
            }`}
            onClick={() => setView("map")}
          >
            {t("search.map")}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {view === "list" && loading && (
        <div className="flex justify-center mt-10">
          <span className="text-gray-500">{t("common.loading")}</span>
        </div>
      )}

      {/* Empty State */}
      {view === "list" && !loading && sarqyts.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-16 text-center text-gray-500 px-4">
          <SearchX className="w-40 h-40 mb-4" />
          <p>{t("search.noResults")}</p>
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 px-4">
          {sarqyts.map((item) => (
            <li key={item.id}>
              <SarqytCard
                key={item.id}
                id={item.id}
                product_title={item.product_title}
                pickup_start={item.pickup_start}
                pickup_end={item.pickup_end}
                product_image={item.product_image}
                quantity_available={item.quantity_available}
                original_price={item.original_price}
                discounted_price={item.discounted_price}
                isFavorite={item.isFavorite}
                getSarqytsData={getSarqytsData}
                status={item.status}
                logo={item.logo}
                shop={item.shop}
              />
            </li>
          ))}
        </ul>
      )}

      {/* Map View */}
      {view === "map" && <YandexAllShopsMap shops={dummyShops} />}
    </div>
  );
};

export default Search;
