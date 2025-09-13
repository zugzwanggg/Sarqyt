import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, CreditCard, ChevronLeft } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import OrderCard from "../components/OrderCard";
import type { IOrder } from "../types";
import { getOrderById } from "../api/order";
import { cancelReservation } from "../api/sarqyt";
import { useTranslation } from "react-i18next";

const OrderPage = () => {
  const { t } = useTranslation(); // hook for translations
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
    if (!confirm(t("order.cancelConfirm"))) return;

    setIsCancelling(true);
    try {
      await cancelReservation(id!);
      alert(t("order.cancelSuccess"));
      fetchOrder();
    } catch (error) {
      console.error(error);
      alert(t("order.cancelFail"));
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) return <p className="p-4 text-center">{t("common.loading")}</p>;
  if (!order) return <p className="p-4 text-center">{t("order.notFound")}</p>;

  const qrValue = { id: order.id, pickup_code: order.pickup_code };

  const isInactive = order.status === "completed" || order.status === "cancelled";

  const renderStatusBanner = () => {
    switch (order.status) {
      case "reserved":
        return (
          <div className="sticky top-0 z-50 bg-yellow-100 text-yellow-800 p-3 text-center font-medium shadow-md">
            {t("order.status.reserved")}
          </div>
        );
      case "confirmed":
        return (
          <div className="sticky top-0 z-50 bg-green-100 text-green-800 p-3 text-center font-medium shadow-md">
            {t("order.status.confirmed")}
          </div>
        );
      case "completed":
        return (
          <div className="sticky top-0 z-50 bg-blue-100 text-blue-800 p-3 text-center font-medium shadow-md">
            {t("order.status.completed")}
          </div>
        );
      case "canceled":
        return (
          <div className="sticky top-0 z-50 bg-red-100 text-red-800 p-3 text-center font-medium shadow-md">
            {t("order.status.canceled")}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 pb-28 space-y-6">
      {renderStatusBanner()}
      <button
        onClick={() => nav(-1)}
        className="flex items-center gap-2 text-primaryColor font-medium mb-4"
      >
        <ChevronLeft /> {t("common.back")}
      </button>

      <OrderCard order={order} />

      {!isInactive &&
        (order.status === "reserved" || order.status === "confirmed") &&
        order.pickup_code && (
          <div className="bg-white shadow rounded-2xl p-6 flex flex-col items-center gap-4">
            <h2 className="text-lg font-semibold">{t("order.pickupQrTitle")}</h2>
            <QRCodeCanvas value={JSON.stringify(qrValue)} size={180} />
            <p className="text-gray-500 text-sm text-center">
              {t("order.pickupQrDesc")}
            </p>
          </div>
        )}

      {/* Shop information */}
      <div className="bg-white shadow rounded-2xl p-4 space-y-2">
        <h3 className="font-semibold text-md">{t("order.shopInfo")}</h3>
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

      <div className="bg-white shadow rounded-2xl p-4 space-y-2">
        <h3 className="font-semibold text-md">{t("order.yourSarqyt")}</h3>
        <div className="flex items-center gap-4">
          <img
            src={order.sarqyt_image}
            alt={order.sarqyt_title}
            className="w-16 h-16 rounded-xl object-cover border"
          />
          <div>
            <p className="font-medium">{order.sarqyt_title}</p>
            <p className="text-sm text-gray-500">
              {t("order.quantity")}: {order.quantity} × {order.discounted_price} ₸
            </p>
            <p className="text-primaryColor font-semibold">
              {t("order.total")}: {order.total_price} ₸
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-2xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" /> {t("order.pickupTime")}:{" "}
          {order.pickup_time
            ? new Date(order.pickup_time).toLocaleString()
            : t("order.notSet")}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CreditCard className="w-4 h-4" /> {t("order.payment")}: {order.payment_method} (
          {order.payment_status})
        </div>
      </div>

      {(order.status === "reserved" || order.status === "confirmed") && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg p-4">
          <button
            onClick={cancelOrder}
            disabled={isCancelling}
            className="w-full bg-red-500 text-white rounded-2xl py-3 font-semibold hover:opacity-90 transition"
          >
            {isCancelling ? t("order.cancelling") : t("order.cancel")}
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
