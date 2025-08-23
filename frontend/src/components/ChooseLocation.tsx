import { useEffect, useState } from "react";
import { ChevronLeft, Search } from "lucide-react";
import type { ICity } from "../types";
import { api } from "../App";
import Loader from "./Loader";
import { Skeleton } from "@radix-ui/themes";
import useDebounce from "../hooks/useDebounce";
import { useUser } from "../context/UserContext";

const ChooseLocation = () => {
  const { user, setIsSelectLocation } = useUser();
  const [city, setCity] = useState<null | number>(null);
  const [searchValue, setSearchValue] = useState("");
  const [cities, setCities] = useState<ICity[]>([]);
  const [isCitiesLoading, setIsCitiesLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useDebounce(searchValue, 300);

  const getCities = async (query: string) => {
    setIsCitiesLoading(true);
    try {
      const data = (await api.get(`/api/cities?search=${encodeURIComponent(query)}`)).data;
      setCities(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsCitiesLoading(false);
    }
  };

  useEffect(() => {
    getCities(debouncedSearch);
  }, [debouncedSearch]);

  const handleSelectAddress = (id: number, value: string) => {
    if (city === id) {
      setCity(null);
      setSearchValue("");
    } else {
      setCity(id);
      setSearchValue(value);
    }
  };

  const saveUserCity = async () => {
    setIsLoading(true);
    try {
      await api.patch("/api/user/city", {
        cityId: city,
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b px-4 py-4 flex items-center justify-between">
        {user?.city && (
          <button onClick={() => setIsSelectLocation(false)}>
            <ChevronLeft size="1.75rem" />
          </button>
        )}
        <h2 className="text-lg font-semibold text-center flex-1">Choose Location</h2>
        <div className="w-7">{/* placeholder for symmetry */}</div>
      </div>

      {/* Search */}
      <div className="px-4 mt-4">
        <label
          htmlFor="citySearch"
          className="flex items-center gap-3 px-4 py-3 bg-zinc-100 rounded-xl border border-zinc-300"
        >
          <Search className="text-zinc-500" size="1.25rem" />
          <input
            id="citySearch"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search for your city..."
            className="w-full bg-transparent outline-none text-sm"
          />
        </label>
      </div>

      {/* Cities list */}
      <div className="flex-1 overflow-y-auto px-4 mt-4">
        {isCitiesLoading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} width="100%" height="48px" />
            ))}
          </div>
        ) : (
          <ul className="space-y-2">
            {cities.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSelectAddress(item.id, item.name)}
                className={`p-4 rounded-xl cursor-pointer border transition ${
                  user?.cityId === item.id || city === item.id
                    ? "border-primaryColor bg-primaryColor/5 text-primaryColor"
                    : "border-zinc-200 hover:bg-zinc-50"
                }`}
              >
                {item.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-white border-t px-4 py-4">
        <button
          onClick={saveUserCity}
          disabled={!city || isLoading}
          className={`w-full rounded-xl py-3 font-medium transition ${
            city
              ? "bg-primaryColor text-white hover:bg-primaryColor/90"
              : "bg-zinc-300 text-zinc-500 cursor-not-allowed"
          }`}
        >
          {isLoading ? <Loader /> : "Apply"}
        </button>
      </div>
    </div>
  );
};

export default ChooseLocation;