import { DollarSign, Package, ListOrdered, Clock, type LucideProps } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getDashboardData, getRecentOrders } from "../api/seller";
import type { IOrder } from "../types";

type TypeStats = {
  title: string;
  value: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  color: string;
};

const Dashboard = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [stats, setStats] = useState<TypeStats[]>([]);
  const [filter, setFilter] = useState<"day" | "week" | "month" | "year">("day");

  const fetchStats = async () => {
    try {
      const data = await getDashboardData(user?.shop_id, filter);
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
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOrders = async () => {
    try {
      const data = await getRecentOrders(user?.shop_id, 5, filter, null);
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user?.shop_id) {
      fetchStats();
      fetchOrders();
    }
  }, [filter, user?.shop_id]);

  return (
    <div className="p-4 pt-6 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Seller Dashboard</h1>

        {/* Filter buttons */}
        <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
          {["day", "week", "month", "year"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as typeof filter)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition 
                ${
                  filter === f
                    ? "bg-primaryColor text-white shadow"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.title}
            className="flex items-center p-4 rounded-xl bg-white shadow hover:shadow-md transition"
          >
            <div className={`p-3 rounded-full ${item.color} mr-4`}>
              <item.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{item.title}</p>
              <p className="text-lg font-semibold">{item.value || 0}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <Link
            className="font-medium text-primaryColor hover:opacity-70"
            to={`/orders`}
          >
            See all →
          </Link>
        </div>
        <ul className="divide-y divide-gray-200">
          {orders.length > 0 ? (
            orders.map((order) => (
              <li
                key={order.id}
                className="flex justify-between py-2 items-center"
              >
                <span>
                  #{order.id} - {order.sarqyt_title}
                </span>
                <span
                  className={`text-sm font-medium ${
                    order.status === "completed"
                      ? "text-green-600"
                      : order.status === "canceled"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {order.status}
                </span>
              </li>
            ))
          ) : (
            <li className="py-4 text-center text-gray-500 text-sm">
              No recent orders
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;