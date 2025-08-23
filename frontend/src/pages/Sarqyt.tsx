import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  Heart,
  Clock,
  Star,
  MapPin,
  ChevronRight,
} from "lucide-react";
import {
  addSarqytToFavorites,
  getSarqytById,
  removeSarqytFromFavorites,
  reserveSarqyt,
} from "../api/sarqyt";
import type { IExtendedSarqytCard } from "../types";
import ReserveModal from "../components/ReserveModal";

const Sarqyt = () => {
  const { id } = useParams();
  const nav = useNavigate();

  const [sarqyt, setSarqyt] = useState<IExtendedSarqytCard>();
  const [textCrop, setTextCrop] = useState(true);
  const [isReserveOpen, setIsReserveOpen] = useState(false);

  const getSarqyt = async () => {
    try {
      const res = await getSarqytById(id!);
      setSarqyt(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSarqyt();
  }, [id]);

  const handleHeartClick = async () => {
    try {
      if (sarqyt?.isFavorite) {
        await removeSarqytFromFavorites(id!);
      } else {
        await addSarqytToFavorites(id!);
      }
      await getSarqyt();
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirmReserve = async (quantity:number) => {

    try {

      await reserveSarqyt(id!, sarqyt?.shop_id!, quantity);
      getSarqyt();
    } catch (error) {
      console.log(error);
    } finally {
      setIsReserveOpen(false);
    }
  };

  return (
    <div className="pb-28">
      {/* Hero section */}
      <div className="relative">
        <img
          className="aspect-video w-full object-cover"
          src={sarqyt?.image_url}
          alt={sarqyt?.title}
        />
        <span className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 rounded-b-3xl" />

        {/* Floating buttons */}
        <div className="absolute top-4 left-4 flex gap-2">
          <button
            onClick={() => nav(-1)}
            className="backdrop-blur-md bg-white/80 hover:bg-white w-10 h-10 rounded-full grid place-content-center shadow-md"
          >
            <ChevronLeft />
          </button>
        </div>
        <div className="absolute top-4 right-4">
          <button
            onClick={handleHeartClick}
            className="backdrop-blur-md bg-white/80 hover:bg-white w-10 h-10 rounded-full grid place-content-center shadow-md"
          >
            <Heart
              className={`${
                sarqyt?.isFavorite ? "fill-primaryColor text-primaryColor" : ""
              }`}
            />
          </button>
        </div>

        <div className="absolute bottom-4 left-4 flex items-center gap-4 text-white">
          <Link to={`/shops/${sarqyt?.shop_id}`}>
            <img
              className="w-16 h-16 shrink-0 rounded-full object-cover border-2 border-white shadow-md"
              src={sarqyt?.shop_img}
              alt={sarqyt?.title}
            />
          </Link>
          <h1 className="text-2xl font-bold drop-shadow-md">{sarqyt?.title}</h1>
        </div>
      </div>

      {/* Info section */}
      <div className="px-4 mt-6 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Star
              size={20}
              className="text-yellow-500 fill-yellow-500 drop-shadow-sm"
            />
            <span className="font-medium">{sarqyt?.rate ?? "New"}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Clock size={20} className="text-primaryColor" />
            <p className="text-sm">
              Collect:{" "}
              <span className="font-medium">
                {sarqyt?.pickup_start} – {sarqyt?.pickup_end}
              </span>
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-gray-400 line-through text-sm">
            {sarqyt?.original_price}
          </span>
          <h3 className="text-primaryColor text-2xl font-bold">
            {sarqyt?.discounted_price}
          </h3>
        </div>
      </div>

      {/* Shop address */}
      <Link
        to={`/shops/${sarqyt?.shop_id}`}
        className="flex items-center gap-3 p-4 border-y mt-6 hover:bg-gray-50 transition"
      >
        <MapPin className="text-primaryColor" />
        <div className="flex-1">
          <p className="font-medium text-primaryColor">{sarqyt?.address}</p>
          <span className="text-sm text-gray-500">
            Tap for more information about this shop
          </span>
        </div>
        <ChevronRight className="text-gray-400" />
      </Link>

      {/* Description */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">What you could get</h2>
        <p className={`${textCrop ? "line-clamp-4" : ""} text-gray-700`}>
          {sarqyt?.description}
        </p>
        {sarqyt?.description && sarqyt?.description.length > 150 && (
          <button
            onClick={() => setTextCrop((prev) => !prev)}
            className="mt-2 text-primaryColor font-medium"
          >
            {textCrop ? "Read more" : "Show less"}
          </button>
        )}

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mt-4">
          {sarqyt?.categories?.map((c) => (
            <span
              key={c}
              className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full text-gray-700"
            >
              {c}
            </span>
          ))}
        </div>
      </div>


      <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg px-4 py-5">
        {sarqyt?.isReserved ? (
          <button
            disabled
            className="w-full bg-gray-300 text-gray-600 font-semibold rounded-2xl py-4 text-lg shadow-md cursor-not-allowed"
          >
            Already Reserved
          </button>
        ) : (
          <button
            onClick={() => setIsReserveOpen(true)}
            className="w-full bg-gradient-to-r from-primaryColor to-green-500 text-white font-semibold rounded-2xl py-4 text-lg shadow-md hover:opacity-90 transition"
          >
            Reserve
          </button>
        )}
      </div>

      {isReserveOpen && (
        <ReserveModal
          onClose={() => setIsReserveOpen(false)}
          onConfirm={handleConfirmReserve}
          title={sarqyt?.title ?? "Unknown"}
          price={sarqyt?.discounted_price ?? ""}
        />
      )}
    </div>
  );
};

export default Sarqyt;