import { Calendar, CreditCard, Store, Hash, CheckCircle, Clock } from "lucide-react";
import type { IOrder } from "../types";
import { useNavigate } from "react-router-dom";

export default function OrderCard({ order }: { order: IOrder }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "paid":
        return "bg-blue-100 text-blue-700";
      case "confirmed":
        return "bg-indigo-100 text-indigo-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "canceled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const nav = useNavigate();

  return (
    <div onClick={()=>nav(`/orders/${order.id}`)} className="w-full max-w-md rounded-2xl shadow-md border border-gray-200 bg-white">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-semibold text-lg">
            <Hash className="w-4 h-4" /> Order #{order.id}
          </h2>
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <Calendar className="w-3 h-3" />{" "}
            {new Date(order.created_at).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-2 text-sm">
            <Store className="w-4 h-4" /> {order.shop_name}
          </span>
          <span className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4" /> {order.sarqyt_title} ×{" "}
            {order.quantity}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">{order.total_price} ₸</span>
          <span
            className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(
              order.status
            )}`}
          >
            {order.status}
          </span>
        </div>

        <div className="flex flex-col gap-1 text-sm">
          <span className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> {order.payment_method} (
            {order.payment_status})
          </span>
          {order.pickup_code && (
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> Pickup code:{" "}
              <span className="font-mono font-semibold">{order.pickup_code}</span>
            </span>
          )}
          {order.pickup_time && (
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> Picked at{" "}
              {new Date(order.pickup_time).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
