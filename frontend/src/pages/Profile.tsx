import { Settings, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import OrderCard from "../components/OrderCard"; 
import { useEffect, useState } from "react";
import { getUserOrders } from "../api/user";
import type { IOrder } from "../types";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const { t } = useTranslation();

  const getOrders = async () => {
    try {
      const data = await getUserOrders();
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div className="px-4 py-6">
      {/* Profile Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-full bg-primaryColor text-white flex items-center justify-center text-xl font-bold">
            {user.username[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-lg font-semibold">{user.username}</h1>
            <p className="text-sm text-gray-500">{t("profile.welcomeBack")} 👋</p>
          </div>
        </div>
        <Link to="/settings" className="text-primaryColor hover:opacity-80">
          <Settings size={"2rem"} />
        </Link>
      </div>

      {/* Orders Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">{t("profile.myOrders")}</h2>

        {orders.length <= 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <ShoppingBag size={"4rem"} className="mb-6 text-primaryColor" />
            <h2 className="text-lg font-semibold">{t("profile.noOrders")}</h2>
            <p className="w-72 mb-4 text-gray-500">
              {t("profile.noOrdersDescription")}
            </p>
            <Link
              to="/search"
              className="px-4 py-2 rounded-xl bg-primaryColor text-white font-medium hover:opacity-90 transition"
            >
              {t("profile.findSarqyt")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
