import {Heart} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ISarqytCard } from "../types";
import { addSarqytToFavorites, removeSarqytFromFavorites } from "../api/sarqyt";

const SarqytCard = ({id, title, pickup_start, pickup_end, original_price, discounted_price, image_url, quantity_available}:ISarqytCard) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const nav = useNavigate();

  console.log(quantity_available);
  
  const handleCardClick = () => {
    nav(`/sarqyts/${id}`)
  }

  const handleHeartClick = async (e:React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation();
    try {
      if (isFavorite) {
        await addSarqytToFavorites(id)
      } else {
        await removeSarqytFromFavorites(id);
      }
    } catch (error) {
      console.log(error);
    }
    setIsFavorite(prev=>!prev)
  }
  
  return (
    <div onClick={handleCardClick} className="block p-1 border-2 rounded-lg duration-300 cursor-pointer">
      <img src={image_url} className="aspect-video h-28 w-full object-cover bg-zinc-500 rounded-md" alt="Sarqyt card" />
      <div className="flex items-center justify-between mt-2">
        <h3>
          {title}
        </h3>
        <Heart onClick={(e)=>handleHeartClick(e)} className={`text-primaryColor ${isFavorite ? 'fill-primaryColor' : ''}`}/>
      </div>
      <p>
        Collect today: {pickup_start}-{pickup_end}
      </p>
      <div className="flex justify-end items-center gap-2 mt-3">
        <span className="line-through text-zinc-400">
          {original_price}
        </span>
        <span className="font-bold text-xl text-primaryColor">
          {discounted_price}
        </span>
      </div>
    </div>
  )
}

export default SarqytCard