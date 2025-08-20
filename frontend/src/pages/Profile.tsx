import { Settings, ShoppingBag } from "lucide-react"
import { Link } from "react-router-dom"
import { useUser } from "../context/UserContext"

const sarqyts = [
  {
    "id":1,
    "shop_id":1,
    "title":"Surprise Doner Combo",
    "original_price":"1500.00",
    "discounted_price":"500.00",
    "quantity_available":10,
    "pickup_start":"18:00:00",
    "pickup_end":"20:00:00",
    "available_until":"2025-07-24 15:16:34.339331",
    "image_url":"https://wallpaperaccess.com/full/9986536.jpg",
    "created_at":"2025-07-23 15:16:34.339331"
  },
  {
    "id":1,
    "shop_id":1,
    "title":"Surprise Doner Combo",
    "original_price":"1500.00",
    "discounted_price":"500.00",
    "quantity_available":10,
    "pickup_start":"18:00:00",
    "pickup_end":"20:00:00",
    "available_until":"2025-07-24 15:16:34.339331",
    "image_url":"https://wallpaperaccess.com/full/9986536.jpg",
    "created_at":"2025-07-23 15:16:34.339331"
  },
  {
    "id":1,
    "shop_id":1,
    "title":"Surprise Doner Combo",
    "original_price":"1500.00",
    "discounted_price":"500.00",
    "quantity_available":10,
    "pickup_start":"18:00:00",
    "pickup_end":"20:00:00",
    "available_until":"2025-07-24 15:16:34.339331",
    "image_url":"https://wallpaperaccess.com/full/9986536.jpg",
    "created_at":"2025-07-23 15:16:34.339331"
  },
  {
    "id":1,
    "shop_id":1,
    "title":"Surprise Doner Combo",
    "original_price":"1500.00",
    "discounted_price":"500.00",
    "quantity_available":10,
    "pickup_start":"18:00:00",
    "pickup_end":"20:00:00",
    "available_until":"2025-07-24 15:16:34.339331",
    "image_url":"https://wallpaperaccess.com/full/9986536.jpg",
    "created_at":"2025-07-23 15:16:34.339331"
  },
  {
    "id":1,
    "shop_id":1,
    "title":"Surprise Doner Combo",
    "original_price":"1500.00",
    "discounted_price":"500.00",
    "quantity_available":10,
    "pickup_start":"18:00:00",
    "pickup_end":"20:00:00",
    "available_until":"2025-07-24 15:16:34.339331",
    "image_url":"https://wallpaperaccess.com/full/9986536.jpg",
    "created_at":"2025-07-23 15:16:34.339331"
  }
]


const Profile = () => {

  const {user} = useUser();

  return (
    <>
      <div className="flex items-center justify-between mt-6 border-b-2 pb-4">
        <div className="flex items-center gap-4">
          <img className="w-14 h-14 bg-lightGreen rounded-full" alt="" />
          <h1 className="text-lg">
            {user.username}
          </h1>
        </div>
        <Link to={'/settings'} className="text-primaryColor">
          <Settings size={'2rem'}/>
        </Link>
      </div>


      {
        sarqyts.length <= 0
        ?
        <div className="h-screen text-center absolute  left-1/2 -translate-x-1/2 top-0 py-64">
          <ShoppingBag size={'4rem'} className="mx-auto mb-6 text-primaryColor"/>
          <h2 className="text-lg">
            You have no favorites
          </h2>
          <p className="w-72 mb-2">
            Seems you haven't added anything to your favorites.
          </p>
          <Link to={'/search'} className="underline text-primaryColor font-medium">
            Find a Sarqyt
          </Link>
        </div>
        :
        ''
      }
    </>
  )
}

export default Profile