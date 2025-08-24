import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ISarqytCard } from "../types";
import { addSarqytToFavorites, removeSarqytFromFavorites } from "../api/sarqyt";
import { format } from "date-fns";

const SarqytCard = ({
  id,
  title,
  pickup_start,
  pickup_end,
  original_price,
  discounted_price,
  image_url,
  quantity_available,
  isFavorite,
  getSarqytsData,
  status,
}: ISarqytCard) => {
  const nav = useNavigate();

  const handleCardClick = () => {

    nav(`/sarqyts/${id}`);
  
  };

  const handleHeartClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    try {
      if (isFavorite) {
        await removeSarqytFromFavorites(id);
      } else {
        await addSarqytToFavorites(id);
      }
      getSarqytsData();
    } catch (error) {
      console.log(error);
    }
  };

  const isDisabled = status === "expired" || status === "sold_out";

  return (
    <div
      onClick={handleCardClick}
      className={`group relative overflow-hidden rounded-2xl border bg-white shadow-md transition hover:shadow-lg cursor-pointer`}
    >
      {/* Image + heart */}
      <div className="relative">
        <img
          src={image_url}
          alt={title}
          className={`h-40 w-full object-cover transition-transform group-hover:scale-105 ${
            isDisabled ? "grayscale" : ""
          }`}
        />
        {!isDisabled && (
          <button
            onClick={handleHeartClick}
            className="absolute top-2 right-2 rounded-full bg-white/80 p-2 shadow hover:bg-white transition"
          >
            <Heart
              className={`h-5 w-5 text-primaryColor ${
                isFavorite ? "fill-primaryColor" : ""
              }`}
            />
          </button>
        )}

        {/* Status Overlay */}
        {isDisabled && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-full bg-gray-800/80 px-4 py-2 text-sm font-semibold text-white uppercase tracking-wide">
              {status === "expired" ? "Expired" : "Sold Out"}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>
        <p className="text-sm text-gray-500">
          Collect today:{" "}
          <span className="font-medium">
            {format(new Date(pickup_start), "HH:mm")}–{format(new Date(pickup_end), "HH:mm")}
          </span>
        </p>

        <div className="flex justify-between items-center mt-2">
          <div className="flex flex-col">
            <span className="text-sm line-through text-gray-400">
              {original_price} ₸
            </span>
            <span className="text-xl font-bold text-primaryColor">
              {discounted_price} ₸
            </span>
          </div>
          {quantity_available !== undefined && !isDisabled && (
            <span className="rounded-full bg-primaryColor/10 px-3 py-1 text-xs font-medium text-primaryColor">
              {quantity_available} left
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SarqytCard;