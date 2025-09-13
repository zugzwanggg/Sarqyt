import { X, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ReserveModalProps {
  onClose: () => void;
  onConfirm: (quantity: number) => void;
  title: string;
  price: string | number;
}

const ReserveModal = ({ onClose, onConfirm, title, price }: ReserveModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const { t } = useTranslation();

  const handleDecrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X />
        </button>

        <h2 className="text-xl font-semibold mb-2">{t("reserveModal.title")}</h2>
        <p className="text-gray-600 mb-4">
          {t("reserveModal.message", { title, price })}
        </p>

        {/* Quantity Selector */}
        <div className="flex items-center justify-between border rounded-xl px-4 py-3 mb-4">
          <button
            onClick={handleDecrease}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <Minus />
          </button>
          <span className="text-lg font-semibold">{quantity}</span>
          <button
            onClick={handleIncrease}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <Plus />
          </button>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 rounded-xl py-3 text-gray-600 font-medium hover:bg-gray-100 transition"
          >
            {t("reserveModal.cancel")}
          </button>
          <button
            onClick={() => onConfirm(quantity)}
            className="flex-1 bg-primaryColor text-white rounded-xl py-3 font-medium hover:opacity-90 transition"
          >
            {t("reserveModal.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReserveModal;