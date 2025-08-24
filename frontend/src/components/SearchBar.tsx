import { Search, SlidersHorizontal, X, Clock, MapPin, Leaf } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilter: (filters: any) => void;
}

const SearchBar = ({ onSearch, onFilter }: SearchBarProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  return (
    <div className="w-full">
      {/* Search bar */}
      <div className="flex items-center justify-between gap-4 mt-4">
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex-1 px-2 py-3 border-2 rounded-md"
        >
          <Search size={"1.5rem"} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400" />
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10 pr-4 outline-none placeholder:text-zinc-400 w-full"
            type="text"
            placeholder="Search for restaurants or food..."
          />
        </form>
        <button
          onClick={() => setIsFilterOpen((prev) => !prev)}
          className="border-2 p-3 rounded-md text-primaryColor"
          type="button"
        >
          <SlidersHorizontal />
        </button>
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="mt-4 p-4 border-2 rounded-md bg-white shadow-lg z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Filters</h3>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="text-zinc-500 hover:text-zinc-800"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Dietary Preferences */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Leaf size={18} className="text-green-600" />
                <h4 className="font-medium">Dietary Preferences</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onFilter({ dietary: 'vegetarian' })}
                  className="px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-700 border border-gray-200"
                >
                  Vegetarian
                </button>
                <button
                  onClick={() => onFilter({ dietary: 'vegan' })}
                  className="px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-700 border border-gray-200"
                >
                  Vegan
                </button>
                <button
                  onClick={() => onFilter({ dietary: 'glutenFree' })}
                  className="px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-700 border border-gray-200"
                >
                  Gluten-Free
                </button>
              </div>
            </div>

            {/* Pickup Times */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock size={18} className="text-blue-600" />
                <h4 className="font-medium">Pickup Time</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => onFilter({ pickupTime: 'morning' })}
                  className="px-3 py-2 rounded-md text-sm bg-gray-100 text-gray-700 border border-gray-200"
                >
                  Morning
                </button>
                <button
                  onClick={() => onFilter({ pickupTime: 'afternoon' })}
                  className="px-3 py-2 rounded-md text-sm bg-gray-100 text-gray-700 border border-gray-200"
                >
                  Afternoon
                </button>
                <button
                  onClick={() => onFilter({ pickupTime: 'evening' })}
                  className="px-3 py-2 rounded-md text-sm bg-gray-100 text-gray-700 border border-gray-200"
                >
                  Evening
                </button>
              </div>
            </div>

            {/* Distance */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={18} className="text-red-600" />
                <h4 className="font-medium">Distance</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onFilter({ maxDistance: 1 })}
                  className="px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-700 border border-gray-200"
                >
                  Under 1 km
                </button>
                <button
                  onClick={() => onFilter({ maxDistance: 3 })}
                  className="px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-700 border border-gray-200"
                >
                  Under 3 km
                </button>
                <button
                  onClick={() => onFilter({ maxDistance: 5 })}
                  className="px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-700 border border-gray-200"
                >
                  Under 5 km
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;