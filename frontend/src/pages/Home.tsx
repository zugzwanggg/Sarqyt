import { useState, useEffect } from "react";
import { LocateFixed } from "lucide-react";
import { Link } from "react-router-dom";
import SarqytCard from "../components/SarqytCard";
import { useUser } from "../context/UserContext";
import { getSarqytCategories, getSarqyts } from "../api/sarqyt";
import type { ICategory, ISarqytCard } from "../types";

const Home = () => {
  const [category, setCategory] = useState<number[] | null>(null);
  const [sarqyts, setSarqyts] = useState<ISarqytCard[]>([]);
  const { user, setIsSelectLocation } = useUser();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [sections, setSections] = useState<
    { title: string; type: string; items: ISarqytCard[] }[]
  >([]);

  const getCategories = async () => {
    try {
      const res = await getSarqytCategories();
      setCategories(res);
    } catch (error) {
      console.log(error);
    }
  };

  const getSarqytsData = async () => {
    try {
      const data = await getSarqyts(category);
      setSarqyts(data);

      const newSections = [
        { title: "New Surprise Bags", type: "new", items: data.slice(0, 5) }
      ];

      categories.forEach((cat) => {
        newSections.push({
          title: cat.name,
          type: cat.name.toLowerCase(),
          items: data.slice(0, 5) // just pick first few, you can filter later
        });
      });
      
      setSections(newSections)

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    getSarqytsData();
  }, [category]);

  const handleSelectCategory = (categoryId:number) => {
    setCategory(prev => {
      if (!prev) return [categoryId];
      if (prev?.includes(categoryId)) {
        return prev.filter(id => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }

  return (
    <div className="px-4 pb-10">
      {/* Top bar */}
      <div
        onClick={() => setIsSelectLocation(true)}
        className="sticky top-0 z-10 flex items-center gap-3 bg-white py-4 shadow-sm cursor-pointer"
      >
        <span className="bg-lightGreen w-10 h-10 grid place-content-center rounded-full">
          <LocateFixed className="text-primaryColor" />
        </span>
        <div className="flex items-center gap-2 overflow-hidden">
          <p className="font-semibold text-nowrap">Chosen Location:</p>
          <p className="truncate text-gray-600">{user?.city || "Select"}</p>
        </div>
      </div>

      {/* Greeting */}
      <div className="mt-6">
        <h1 className="text-2xl font-bold">
          Hey {user?.username || "User"} 👋
        </h1>
        <p className="text-gray-500">Find surprises waiting near you</p>
      </div>

      {/* Categories */}
      <ul className="flex items-center gap-2 overflow-x-auto mt-5 pb-2 no-scrollbar">
        <li
          onClick={() => setCategory(null)}
          className={`whitespace-nowrap px-4 py-2 rounded-full border transition cursor-pointer ${
            category === null
              ? "bg-primaryColor text-white border-primaryColor"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All
        </li>
        {categories.map((item) => (
          <li
            key={item.id}
            onClick={() => handleSelectCategory(item.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-full border transition cursor-pointer ${
              category?.some(id => id === item.id)
                ? "bg-primaryColor text-white border-primaryColor"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {item.name}
          </li>
        ))}
      </ul>

      {/* Section header */}
      <div className="flex items-center justify-between mt-8 mb-4">
        <h2 className="text-xl font-semibold">Sarqyts in your area</h2>
        <Link
          className="font-medium text-primaryColor hover:opacity-70"
          to="/all?type=city"
        >
          See all →
        </Link>
      </div>

      {/* Sarqyt list */}
      {sarqyts.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No sarqyts found in this category 🥲
        </p>
      ) : (
        <ul className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {sarqyts.map((item) => (
            <li key={item.id} className="flex-shrink-0 w-64">
              <SarqytCard
                key={item.id}
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
              />
            </li>
          ))}
        </ul>
      )}

    {sections.map((section) => (
        <div key={section.title} className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{section.title}</h2>
            <Link
              className="font-medium text-primaryColor hover:opacity-70"
              to={`/all?type=${section.type}`}
            >
              See all →
            </Link>
          </div>
          {section.items.length === 0 ? (
            <p className="text-gray-500">No items yet 🥲</p>
          ) : (
            <ul className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {section.items.map((item) => (
                <li key={item.id} className="flex-shrink-0 w-64">
                  <SarqytCard
                    key={item.id}
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
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
      
    </div>
  )
};

export default Home;