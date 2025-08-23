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
    <>
      <h1 className="text-2xl mt-8 mb-4">
        Favorites
      </h1>


      {
        sarqyts.length <= 0
        ?
        <div className="h-screen text-center absolute  left-1/2 -translate-x-1/2 top-0 py-64">
          <UtensilsCrossed size={'4rem'} className="mx-auto mb-6 text-primaryColor"/>
          <h2 className="text-lg">
            You have no favorites
          </h2>
          <p className="w-72 mb-2">
            Seems you haven't added anything to your favorites.
          </p>
          <Link to={'/search'} className="underline text-primaryColor font-medium">
            Add a sarqyt to your favorites
          </Link>
        </div>
        :
        <ul className="flex flex-col mt-10 gap-4">
          {
            sarqyts.map(item => {
              return <li className="flex-shrink-0">
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
                  getSarqytsData={getFavorites}
                />
                
              </li>
            })
          }
          
        </ul>
      }

      
      
    </>
  )
}

export default Favorites