import SarqytCard from "../components/SarqytCard";
import SearchBar from "../components/SearchBar";

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


const Search = () => {
  return (
    <>
      <SearchBar/>


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
              />
              
            </li>
          })
        }
        
      </ul>
    </>
  )
}

export default Search