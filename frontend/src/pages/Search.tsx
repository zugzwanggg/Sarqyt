import { useEffect, useState } from "react";
import SarqytCard from "../components/SarqytCard";
import SearchBar from "../components/SearchBar";
import { getSarqyts } from "../api/sarqyt";
import type { ISarqytCard } from "../types";
import { search } from "../api/user";
import { SearchX } from "lucide-react";
import YandexAllShopsMap from "../components/YandexAllShopsMap"; 
import type { IShop } from "../types";


export const dummyShops: IShop[] = [
  {
    id: 1,
    name: "Green Bakery",
    image_url: "https://source.unsplash.com/80x80/?bakery,bread",
    rating: 4.7,
    address: "Satpayev Ave 15, Atyrau",
    lat: 47.0945,
    lng: 51.9238,
  },
  {
    id: 2,
    name: "Atyrau Coffee House",
    image_url: "https://source.unsplash.com/80x80/?coffee,cafe",
    rating: 4.5,
    address: "Abai St 10, Atyrau",
    lat: 47.0955,
    lng: 51.9275,
  },
  {
    id: 3,
    name: "Nomad Hotel Restaurant",
    image_url: "https://source.unsplash.com/80x80/?restaurant,food",
    rating: 4.3,
    address: "Azattyk Ave 22, Atyrau",
    lat: 47.092,
    lng: 51.9205,
  },
  {
    id: 4,
    name: "Fresh Market",
    image_url: "https://source.unsplash.com/80x80/?market,vegetables",
    rating: 4.6,
    address: "Zhubanov St 5, Atyrau",
    lat: 47.0972,
    lng: 51.925,
  },
  {
    id: 5,
    name: "City Pizza",
    image_url: "https://source.unsplash.com/80x80/?pizza,food",
    rating: 4.4,
    address: "Satpayev Ave 30, Atyrau",
    lat: 47.093,
    lng: 51.9285,
  },
];

const Search = () => {
  const [sarqyts, setSarqyts] = useState<ISarqytCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "map">("list"); // toggle state

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
            List
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium ${
              view === "map"
                ? "bg-primaryColor text-white"
                : "bg-gray-100 text-gray-600"
            }`}
            onClick={() => setView("map")}
          >
            Map
          </button>
        </div>
      </div>

      {/* Loading State */}
      {view === "list" && loading && (
        <div className="flex justify-center mt-10">
          <span className="text-gray-500">Loading...</span>
        </div>
      )}

      {/* Empty State */}
      {view === "list" && !loading && sarqyts.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-16 text-center text-gray-500 px-4">
          <SearchX className="w-40 h-40 mb-4" />
          <p>No sarqyts found. Try a different search.</p>
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
