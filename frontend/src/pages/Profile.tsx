import { Settings, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import OrderCard from "../components/OrderCard"; // ✅ reuse the OrderCard component

// Mock orders data for now (replace with API later)
const orders = [
  {
    "id": 1,
    "quantity": 1,
    "total_price": "500.00",
    "status": "paid",
    "payment_method": "kaspi",
    "payment_status": "paid",
    "pickup_code": "X9K2M4",
    "pickup_time": "2025-07-23T18:00:00.000Z",
    "created_at": "2025-07-23T15:16:34.339331",
    "updated_at": "2025-07-23T16:00:00.000Z",

    "sarqyt_id": 11,
    "sarqyt_title": "Surprise Doner Combo",
    "sarqyt_image": "https://wallpaperaccess.com/full/9986536.jpg",
    "discounted_price": "500.00",
    "original_price": "1500.00",

    "shop_id": 101,
    "shop_name": "Doner House",
    "shop_image": "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
    "shop_address": "Astana, Abay Ave 15"
  },
  {
    "id": 2,
    "quantity": 2,
    "total_price": "1500.00",
    "status": "completed",
    "payment_method": "cash",
    "payment_status": "paid",
    "pickup_code": "K4M2Z8",
    "pickup_time": "2025-07-20T12:30:00.000Z",
    "created_at": "2025-07-20T10:10:10.339331",
    "updated_at": "2025-07-20T12:45:00.000Z",

    "sarqyt_id": 22,
    "sarqyt_title": "Burger Surprise Box",
    "sarqyt_image": "https://wallpaperaccess.com/full/9986536.jpg",
    "discounted_price": "750.00",
    "original_price": "2000.00",

    "shop_id": 102,
    "shop_name": "Burger Queen",
    "shop_image": "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
    "shop_address": "Almaty, Dostyk St 120"
  }
]


const Profile = () => {
  const { user } = useUser();

  return (
    <>
      {/* Profile header */}
      <div className="flex items-center justify-between mt-6 border-b-2 pb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img className="w-14 h-14 bg-lightGreen rounded-full" alt="" />
            <span className="absolute inset-0 flex items-center justify-center text-xl font-bold">
              {user.username[0].toUpperCase()}
            </span>
          </div>
          <h1 className="text-lg">{user.username}</h1>
        </div>
        <Link to={"/settings"} className="text-primaryColor">
          <Settings size={"2rem"} />
        </Link>
      </div>

      {/* Orders section */}
      {orders.length <= 0 ? (
        <div className="h-screen text-center absolute left-1/2 -translate-x-1/2 top-0 py-64">
          <ShoppingBag size={"4rem"} className="mx-auto mb-6 text-primaryColor" />
          <h2 className="text-lg">You have no orders</h2>
          <p className="w-72 mb-2">Seems you haven't ordered anything yet.</p>
          <Link to={"/search"} className="underline text-primaryColor font-medium">
            Find a Sarqyt
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </>
  );
};

export default Profile;
