import { Search, SlidersHorizontal, X, Clock } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilter: (query: string, period:string) => void;
}

const SearchBar = ({ onSearch, onFilter }: SearchBarProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");

  const periods = ["morning", "afternoon", "evening"];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  const handleApplyFilters = () => {
    onFilter(searchValue, selectedPeriod);
    setIsFilterOpen(false);
  };

  return (
    <div className="w-full">
      {/* Search bar */}
      <div className="flex items-center gap-3 mt-4">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
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
            {/* Pickup Times */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock size={18} className="text-blue-600" />
                <h4 className="font-medium">Pickup Time</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {periods.map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-3 py-2 rounded-md text-sm border transition
                      ${
                        selectedPeriod === period
                          ? "bg-primaryColor text-white border-primaryColor"
                          : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                      }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply Button */}
            <div className="flex justify-end">
              <button
                onClick={handleApplyFilters}
                disabled={!selectedPeriod}
                className={`px-4 py-2 rounded-lg font-medium transition
                  ${
                    selectedPeriod
                      ? "bg-primaryColor text-white hover:bg-primaryColor/90"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;