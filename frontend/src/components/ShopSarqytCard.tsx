import { ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"
import type { IShopSarqytCard } from "../types"
import {format} from "date-fns";


const ShopSarqytCard = ({id,
  title,discounted_price, pickup_start,pickup_end, 
  image_url}:IShopSarqytCard) => {
  return (
    <Link to={`/sarqyts/${id}`} className="flex items-center gap-4 justify-between mb-2">
      <div className="flex items-center gap-4 ">
        <img className="w-16 h-16 rounded-full shrink-0" src={image_url} alt={title} />
        <div>
          <h3>
            {title}
          </h3>
          <span className="text-sm">
            Today: {format(new Date(pickup_start), "HH:mm")} – {format(new Date(pickup_end), "HH:mm")}
          </span>
          <span className="text-primaryColor font-bold text-lg block">
            {Number(discounted_price).toLocaleString()}
          </span>
        </div>
      </div>
      <button className="text-primaryColor">
        <ChevronRight/>
      </button>
    </Link>
  )
}

export default ShopSarqytCard