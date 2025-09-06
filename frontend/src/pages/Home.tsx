import { useState, useEffect } from "react";
import { ChevronDown, LocateFixed } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SarqytCard from "../components/SarqytCard";
import { useUser } from "../context/UserContext";
import { getNewestSarqyts, getSarqyts } from "../api/sarqyt";
import type { ISarqytCard } from "../types";

const categorySections = [
  { id: 1, title: "Meals" },
  { id: 3, title: "Restaurants" },
  { id: 5, title: "Fruits & Vegetables" },
];

const Home = () => {
  const { user, setIsSelectLocation } = useUser();
  const [newestSarqyts, setNewestSarqyts] = useState<ISarqytCard[]>([]);
  const [sectionsData, setSectionsData] = useState<Record<number, ISarqytCard[]>>({});

  const navigate = useNavigate();

  const fetchNewSarqyts = async () => {
    try {
      const data = await getNewestSarqyts(5, null);
      setNewestSarqyts(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategorySarqyts = async (categoryId: number) => {
    try {
      const data = await getSarqyts([categoryId]);
      setSectionsData((prev) => ({ ...prev, [categoryId]: data.slice(0, 5) })); // preview only 5
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user?.role === 'seller' ) navigate('/dashboard')
    fetchNewSarqyts();
    categorySections.forEach((c) => fetchCategorySarqyts(c.id));
  }, []);

  return (
    <div className="px-4 pb-10">
      {/* Location selector */}
      <div
        onClick={() => setIsSelectLocation(true)}
        className="sticky top-0 z-10 flex items-center gap-3 bg-white py-4 shadow-sm cursor-pointer"
      >
        <span className="bg-lightGreen w-10 h-10 grid place-content-center rounded-full">
          <LocateFixed className="text-primaryColor" />
        </span>
        <div className="flex items-center gap-2 overflow-hidden">
          <p className="font-semibold text-nowrap">Chosen Location:</p>
          <p className="truncate text-gray-600">{user?.city_name || "Select"}</p>
        </div>
        <ChevronDown />
      </div>

      <div className="mt-6">
        <h1 className="text-2xl font-bold">
          Hey {user?.username || "User"} 👋
        </h1>
        <p className="text-gray-500">Find surprises waiting near you</p>
      </div>

      {newestSarqyts.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Newest sarqyts</h2>
            <Link
              className="font-medium text-primaryColor hover:opacity-70"
              to={`/all?type=latest`}
            >
              See all →
            </Link>
          </div>
          <ul className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {newestSarqyts.map((item) => (
              <li key={item.id} className="flex-shrink-0 w-64">
                <SarqytCard {...item} getSarqytsData={fetchNewSarqyts} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {categorySections.map((section) => (
        <div key={section.id} className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{section.title}</h2>
            <Link
              className="font-medium text-primaryColor hover:opacity-70"
              to={`/all?type=${section.title}&categoryId=${section.id}`}
            >
              See all →
            </Link>
          </div>
          {sectionsData[section.id]?.length ? (
            <ul className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {sectionsData[section.id].map((item) => (
                <li key={item.id} className="flex-shrink-0 w-64">
                  <SarqytCard
                    {...item}
                    getSarqytsData={() => fetchCategorySarqyts(section.id)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">
              No {section.title.toLowerCase()} found 🥲
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Home;
