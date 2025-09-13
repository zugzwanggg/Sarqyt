import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { IShopSarqytCard } from "../types";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

const ShopSarqytCard = ({
  id,
  product_title,
  discounted_price,
  pickup_start,
  pickup_end,
  product_image,
}: IShopSarqytCard) => {
  const { t } = useTranslation();

  return (
    <Link
      to={`/sarqyts/${id}`}
      className="flex items-center gap-4 justify-between mb-2 p-2 rounded-lg hover:bg-gray-50 transition"
    >
      <div className="flex items-center gap-4">
        <img
          className="w-16 h-16 rounded-full object-cover shrink-0"
          src={product_image || "/placeholder.png"}
          alt={product_title}
        />
        <div className="flex flex-col">
          <h3 className="font-medium text-gray-800 line-clamp-1">{product_title}</h3>
          <span className="text-sm text-gray-500">
            {t("shopSarqytCard.today")}:{" "}
            {format(new Date(pickup_start), "HH:mm")} –{" "}
            {format(new Date(pickup_end), "HH:mm")}
          </span>
          <span className="text-primaryColor font-bold text-lg">
            {Number(discounted_price).toLocaleString()} ₸
          </span>
        </div>
      </div>
      <ChevronRight className="text-primaryColor" />
    </Link>
  );
};

export default ShopSarqytCard;
