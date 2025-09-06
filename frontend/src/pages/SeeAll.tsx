import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SarqytCard from "../components/SarqytCard";
import type { ISarqytCard } from "../types";
import { api } from "../App";
import { ArrowLeft } from "lucide-react";

const SeeAll = () => {
  const [sarqyts, setSarqyts] = useState<ISarqytCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const type = query.get("type") || "latest";
  const categoryId = query.get("categoryId");
  const limit = 20;

  const fetchSarqyts = async () => {
    try {
      setLoading(true);
      setError("");

      let url = "/api/sarqyts";

      if (type === "latest") {
        url = `/api/sarqyts/new?limit=${limit}`;
      } else if (categoryId) {
        url = `/api/sarqyts?categories=${categoryId}&limit=${limit}`;
      }

      const res = await api.get(url);
      setSarqyts(res.data);
    } catch (err) {
      setError("Failed to load sarqyts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSarqyts();
  }, [type, categoryId]);

  return (
    <div className="relative max-w-6xl mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <h1 className="text-2xl font-bold mb-6 text-center mt-16">
        {type === "latest"
          ? "Latest Sarqyts"
          : categoryId
          ? `All from ${type}`
          : "All Sarqyts"}
      </h1>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}
      {!loading && !error && !sarqyts.length && (
        <p className="text-center">No sarqyts found.</p>
      )}

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {sarqyts.map((item) => (
          <li key={item.id}>
            <SarqytCard {...item} getSarqytsData={fetchSarqyts} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SeeAll;