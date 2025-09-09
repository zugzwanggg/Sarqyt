import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { IOrder } from "../types";
import { getRecentOrders } from "../api/seller";
import { useUser } from "../context/UserContext";

const STATUS_OPTIONS = [null, "reserved", "confirmed", "completed", "canceled"];

export default function SellerOrdersPage() {

  const {user} = useUser();

  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string|null>(null);
  const [orders, setOrders] = useState<IOrder[]>([])

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "reserved":
        return "bg-yellow-100 text-yellow-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "canceled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-200 text-gray-600";
    }
  };

  const fetchOrders = async () => {
    try {

      const data = await getRecentOrders(user?.shop_id, 30, 'day', selectedStatus);
      setOrders(data)
      
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=> {
    fetchOrders();
  },[selectedStatus])

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">Orders</h1>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 px-4 py-2 overflow-x-auto border-b">
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              selectedStatus === status
                ? "bg-primaryColor text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'All'}
          </button>
        ))}
      </div>

      {/* Orders list */}
      <div className="flex-1 overflow-y-auto p-4">
        {orders.length === 0 ? (
          <p className="text-gray-500 text-sm">No orders in this status.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-gray-50 rounded-2xl p-4 mb-4 shadow-sm"
            >
              {/* Basic info row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={order.sarqyt_image}
                    alt={order.sarqyt_title}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                  <div>
                    <h2 className="font-semibold text-sm">
                      {order.sarqyt_title}
                    </h2>
                    <p className="text-xs text-gray-600">
                      Qty: {order.quantity} • {order.discounted_price}₸ each
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              {/* Expand button */}
              <button
                onClick={() =>
                  setExpandedOrder(expandedOrder === order.id ? null : order.id)
                }
                className="flex items-center justify-center w-full mt-2 text-sm text-primaryColor"
              >
                {expandedOrder === order.id ? (
                  <>
                    Hide details <ChevronUp className="w-4 h-4 ml-1" />
                  </>
                ) : (
                  <>
                    View details <ChevronDown className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>

              {/* Expanded details */}
              {expandedOrder === order.id && (
                <div className="mt-3 text-sm text-gray-700 space-y-2">
                  <p>
                    <span className="font-medium">Order ID:</span> {order.id}
                  </p>
                  <p>
                    <span className="font-medium">User:</span>{" "}
                    {order.username}₸
                  </p>
                  <p>
                    <span className="font-medium">Total Price:</span>{" "}
                    {order.total_price}₸
                  </p>

                  {order.pickup_time && (
                    <p>
                      <span className="font-medium">Pickup Time:</span>{" "}
                      {new Date(order.pickup_time).toLocaleString()}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">Created At:</span>{" "}
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium">Shop:</span> {order.shop_name},{" "}
                    {order.shop_address}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
