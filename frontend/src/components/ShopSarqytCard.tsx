import { ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"

const sarqyt = {
  "id":1,
  "title":"Surprise Doner Combo",
  "discounted_price":"500.00",
  "quantity_available":10,
  "pickup_start":"18:00",
  "pickup_end":"20:00",
  "image_url":"https://wallpaperaccess.com/full/9986536.jpg",
}

const ShopSarqytCard = () => {
  return (
    <Link to={`/sarqyts/${sarqyt.id}`} className="flex items-center gap-4 justify-between">
      <div className="flex items-center gap-4 ">
        <img className="w-16 h-16 rounded-full shrink-0" src={sarqyt.image_url} alt={sarqyt.title} />
        <div>
          <h3>
            {sarqyt.title}
          </h3>
          <span className="text-sm">
            Today: {sarqyt.pickup_start}:{sarqyt.pickup_end}
          </span>
          <span className="text-primaryColor font-bold text-lg block">
            {sarqyt.discounted_price}
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