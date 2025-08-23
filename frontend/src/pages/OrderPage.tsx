import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, CreditCard, ChevronLeft } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import OrderCard from "../components/OrderCard";
import type { IOrder } from "../types";
import { getOrderById } from "../api/order";
import { cancelReservation } from "../api/sarqyt";

const OrderPage = () => {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchOrder = async () => {
    try {
      const res = await getOrderById(id!);
      setOrder(res);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const cancelOrder = async () => {
    if (!order) return;
    if (!confirm("Are you sure you want to cancel this order?")) return;

    setIsCancelling(true);
    try {
      await cancelReservation(id!);
      alert("Order cancelled successfully");
      fetchOrder(); 
    } catch (error) {
      console.error(error);
      alert("Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) return <p className="p-4 text-center">Loading...</p>;
  if (!order) return <p className="p-4 text-center">Order not found</p>;

  return (
    <div className="p-4 pb-28 space-y-6">
      {/* Back button */}
      <button
        onClick={() => nav(-1)}
        className="flex items-center gap-2 text-primaryColor font-medium mb-4"
      >
        <ChevronLeft /> Back
      </button>

      {/* Order summary card */}
      <OrderCard order={order} />

      {/* QR code for pickup */}
      {order.pickup_code && (
        <div className="bg-white shadow rounded-2xl p-6 flex flex-col items-center gap-4">
          <h2 className="text-lg font-semibold">Your Pickup QR Code</h2>
          <QRCodeCanvas value={order.pickup_code} size={180} />
          <p className="font-mono text-xl">{order.pickup_code}</p>
          <p className="text-gray-500 text-sm text-center">
            Show this QR code at the shop to collect your order.
          </p>
        </div>
      )}

      {/* Shop information */}
      <div className="bg-white shadow rounded-2xl p-4 space-y-2">
        <h3 className="font-semibold text-md">Shop Information</h3>
        <div className="flex items-center gap-4">
          <img
            src={order.shop_image}
            alt={order.shop_name}
            className="w-16 h-16 rounded-full object-cover border"
          />
          <div>
            <p className="font-medium">{order.shop_name}</p>
            <p className="text-sm text-gray-500">{order.shop_address}</p>
          </div>
        </div>
      </div>

      {/* Sarqyt info */}
      <div className="bg-white shadow rounded-2xl p-4 space-y-2">
        <h3 className="font-semibold text-md">Your Sarqyt</h3>
        <div className="flex items-center gap-4">
          <img
            src={order.sarqyt_image}
            alt={order.sarqyt_title}
            className="w-16 h-16 rounded-xl object-cover border"
          />
          <div>
            <p className="font-medium">{order.sarqyt_title}</p>
            <p className="text-sm text-gray-500">
              Quantity: {order.quantity} × {order.discounted_price} ₸
            </p>
            <p className="text-primaryColor font-semibold">
              Total: {order.total_price} ₸
            </p>
          </div>
        </div>
      </div>

      {/* Pickup time & payment info */}
      <div className="bg-white shadow rounded-2xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" /> Pickup Time:{" "}
          {order.pickup_time
            ? new Date(order.pickup_time).toLocaleString()
            : "Not set"}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CreditCard className="w-4 h-4" /> Payment: {order.payment_method} (
          {order.payment_status})
        </div>
      </div>

      {/* Cancel Order button */}
      {order.status !== "cancelled" && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg p-4">
          <button
            onClick={cancelOrder}
            disabled={isCancelling}
            className="w-full bg-red-500 text-white rounded-2xl py-3 font-semibold hover:opacity-90 transition"
          >
            {isCancelling ? "Cancelling..." : "Cancel Order"}
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
