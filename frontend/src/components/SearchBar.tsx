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
      <div className="flex items-center justify-between gap-4 mt-4">
        <form
          onSubmit={handleSearchSubmit}
          className="relative px-2 py-3 border-2 rounded-md w-full"
        >
          <Search size={"1.5rem"} className="absolute left-4 text-zinc-400" />
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10 outline-none placeholder:text-zinc-400 w-full"
            type="text"
            placeholder="Search..."
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
        <div className="mt-4 p-4 border-2 rounded-md bg-white shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Filters</h3>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="text-zinc-500 hover:text-zinc-800"
            >
              <X />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <label className="text-sm text-zinc-500">Min Price</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, minPrice: e.target.value }))
                }
                className="w-full border rounded-md p-2 mt-1"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-500">Max Price</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))
                }
                className="w-full border rounded-md p-2 mt-1"
              />
            </div>

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
              className="mt-2 bg-primaryColor text-white py-2 rounded-md"
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
