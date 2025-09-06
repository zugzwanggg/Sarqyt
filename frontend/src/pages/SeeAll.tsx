import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SarqytCard from "../components/SarqytCard";
import type { ISarqytCard } from "../types";
import { api } from "../App";

const SeeAll = () => {
  const [sarqyts, setSarqyts] = useState<ISarqytCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const type = query.get("type") || "latest"; 

  const fetchSarqyts = async () => {
    const limit = 20;
    try {
      setLoading(true);
      setError("");

      let url = "/api/sarqyts";
      if (type === "latest") url = `/api/sarqyts/new?limit=${limit}`; 

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
  }, [type]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {type === "latest" ? "Latest Sarqyts" : "All Sarqyts"}
      </h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && !sarqyts.length && <p>No sarqyts found.</p>}

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