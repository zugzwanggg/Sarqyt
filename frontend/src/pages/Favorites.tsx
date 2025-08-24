import { UtensilsCrossed } from "lucide-react"
import SarqytCard from "../components/SarqytCard"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { getUserFavorites } from "../api/user"
import type { ISarqytCard } from "../types"


const Favorites = () => {
  const [sarqyts, setSarqyts] = useState<ISarqytCard[]>([])


  const getFavorites = async () => {
    try {

      const data = await getUserFavorites();
      setSarqyts(data)

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=> {
    getFavorites()
  }, [])

  return (
    <div className="px-4 ">
      <h1 className="text-2xl mt-8 mb-4">
        Favorites
      </h1>


      {
        sarqyts.length <= 0 
        ? 
          <div className="flex flex-col items-center justify-center h-[70vh] text-center">
            <UtensilsCrossed size={'4rem'} className="mb-6 text-primaryColor"/>
            <h2 className="text-xl font-semibold">You have no favorites</h2>
            <p className="w-72 mb-4 text-gray-500">
              Seems you haven't added anything to your favorites yet.
            </p>
            <Link 
              to="/search" 
              className="px-4 py-2 rounded-xl bg-primaryColor text-white font-medium hover:opacity-90 transition"
            >
              Browse Sarqyts
            </Link>
          </div>
        :
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {sarqyts.map(item => (
            <li key={item.id}>
              <SarqytCard
                id={item.id}
                title={item.title} 
                pickup_start={item.pickup_start} 
                pickup_end={item.pickup_end}
                image_url={item.image_url}
                quantity_available={item.quantity_available}
                original_price={item.original_price}
                discounted_price={item.discounted_price}
                isFavorite={item.isFavorite}
                getSarqytsData={getFavorites}
                status={item.status}
              />
            </li>
          ))}
        </ul>
      }

      
      
    </div>
  )
}

export default Favorites