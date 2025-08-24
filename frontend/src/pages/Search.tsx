import { useEffect, useState } from "react";
import SarqytCard from "../components/SarqytCard";
import SearchBar from "../components/SearchBar";
import { getSarqyts } from "../api/sarqyt";
import type { ISarqytCard } from "../types";
import { search } from "../api/user";
import {SearchX} from "lucide-react";

const Search = () => {
  const [sarqyts, setSarqyts] = useState<ISarqytCard[]>([]);
  const [loading, setLoading] = useState(true);

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
      const data = await search(query, '');
      setSarqyts(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter =async (query: string, period:string) => {
    try {
      setLoading(true);
      const data = await search(query, period);
      setSarqyts(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getSarqytsData();
  }, []);

  return (
    <div className="px-4 pb-10">
      {/* Search Bar */}
      <div className="sticky top-0 bg-white z-10 py-3">
        <SearchBar onSearch={handleSearch} onFilter={handleFilter}
         />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center mt-10">
          <span className="text-gray-500">Loading...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && sarqyts.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-16 text-center text-gray-500">
          <SearchX
            className="w-40 h-40 mb-4"
          />
          <p>No sarqyts found. Try a different search.</p>
        </div>
      )}

      {/* Grid Results */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {sarqyts.map((item) => (
          <li key={item.id}>
            <SarqytCard
              id={item.id}
              title={item.title}
              pickup_start={item.pickup_start}
              pickup_end={item.pickup_end}
              image_url={item.image_url}
              quantity_available={item.quantity_available}
              original_price={item.original_price}
              discounted_price={item.discounted_price}
              isFavorite={item.isFavorite}
              getSarqytsData={getSarqytsData}
              status={item.status}
              logo={item.logo}
              shop={item.shop}
              showShopInfo={true}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Search;