import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilter?: (filters: any) => void;
}

const SearchBar = ({ onSearch, onFilter }: SearchBarProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    onlyAvailable: false,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  const handleApplyFilters = () => {
    onFilter?.(filters);
    setIsFilterOpen(false);
  };

  return (
    <div className="w-full">
      {/* Search bar */}
      <div className="flex items-center gap-3 mt-4">
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex-1"
        >
          <Search
            size={"1.3rem"}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-full border border-zinc-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryColor/50"
            type="text"
            placeholder="Search sarqyts..."
          />
        </form>

        <button
          onClick={() => setIsFilterOpen((prev) => !prev)}
          className="flex items-center justify-center h-12 w-12 rounded-full bg-primaryColor/10 text-primaryColor hover:bg-primaryColor/20 transition"
          type="button"
        >
          <SlidersHorizontal />
        </button>
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="mt-4 p-5 border border-zinc-200 rounded-2xl bg-white shadow-lg animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Filters</h3>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="text-zinc-400 hover:text-zinc-700 transition"
            >
              <X />
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {/* Min Price */}
            <div>
              <label className="block text-sm text-zinc-600">Min Price</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, minPrice: e.target.value }))
                }
                className="w-full border rounded-lg p-2 mt-1 focus:ring-1 focus:ring-primaryColor/50"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm text-zinc-600">Max Price</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))
                }
                className="w-full border rounded-lg p-2 mt-1 focus:ring-1 focus:ring-primaryColor/50"
              />
            </div>

            {/* Only Available */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.onlyAvailable}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    onlyAvailable: e.target.checked,
                  }))
                }
              />
              <label className="text-sm text-zinc-600">Only available</label>
            </div>

            <button
              onClick={handleApplyFilters}
              type="button"
              className="mt-2 w-full bg-primaryColor text-white py-2.5 rounded-full font-medium hover:opacity-90 transition"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
