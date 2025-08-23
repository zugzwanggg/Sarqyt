import { X } from "lucide-react";

interface ReserveModalProps {
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  price: string | number;
}

const ReserveModal = ({ onClose, onConfirm, title, price }: ReserveModalProps) => {
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

        <h2 className="text-xl font-semibold mb-2">Confirm Reservation</h2>
        <p className="text-gray-600 mb-4">
          Do you want to reserve <span className="font-medium">{title}</span> for{" "}
          <span className="text-primaryColor font-bold">{price}</span>?
        </p>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 rounded-xl py-3 text-gray-600 font-medium hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-primaryColor text-white rounded-xl py-3 font-medium hover:opacity-90 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReserveModal;