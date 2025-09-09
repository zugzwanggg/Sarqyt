import { DollarSign, Package, ListOrdered, Clock, type LucideProps } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getDashboardData, getRecentOrders } from "../api/seller";
import type { IOrder } from "../types";

type TypeStats = {
  title:string;
  value: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  color: string;
}


const Dashboard = () => {

  const {user} = useUser();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [stats, setStats] = useState<TypeStats[]>([]);

  const fetchStats = async () => {
    try {

      const data = await getDashboardData(user?.shop_id);
      setStats([
        {
          title: "Total Earnings",
          value: data?.total_earnings,
          icon: DollarSign,
          color: "bg-green-100 text-green-600",
        },
        {
          title: "Active Products",
          value: data?.active_products,
          icon: Package,
          color: "bg-blue-100 text-blue-600",
        },
        {
          title: "Pending Orders",
          value: data?.pending_orders,
          icon: Clock,
          color: "bg-yellow-100 text-yellow-600",
        },
        {
          title: "Completed Orders",
          value: data?.completed_orders,
          icon: ListOrdered,
          color: "bg-purple-100 text-purple-600",
        },
      ])
    } catch (error) {
      console.log(error);
    }
  }

  const fetchOrders = async () => {
    try {

      const data = await getRecentOrders(user?.shop_id, 5, 'day');
      setOrders(data);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=> {
    fetchStats();
    fetchOrders();
  }, [])




  return (
    <div className="p-4 pt-6 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Seller Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.title}
            className="flex items-center p-4 rounded-lg shadow hover:shadow-md transition"
          >
            <div className={`p-3 rounded-full ${item.color} mr-4`}>
              <item.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{item.title}</p>
              <p className="text-lg font-semibold">{item.value||0}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent orders</h2>
          <Link
            className="font-medium text-primaryColor hover:opacity-70"
            to={`/orders`}
          >
            See all →
          </Link>
        </div>
        <ul className="divide-y divide-gray-200">
          {orders.map((order) => (
            <li
              key={order.id}
              className="flex justify-between py-2 items-center"
            >
              <span>#{order.id} - {order.sarqyt_title}</span>
              <span
                className={`text-sm font-medium ${
                  order.status === "Completed"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {order.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;