import { useState } from "react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import type { IShop } from "../types";

type Props = {
  shops: IShop[];
};

const YandexAllShopsMap = ({ shops }: Props) => {
  const [selectedShop, setSelectedShop] = useState<IShop | null>(null);
  const [ymaps, setYmaps] = useState<any>(null);

  return (
    <div className="relative w-screen h-screen">
      <YMaps>
        <Map
          className="absolute inset-0 w-full h-full"
          defaultState={{
            center: [47.0945, 51.9238],
            zoom: 13,
          }}
          modules={["control.ZoomControl", "layout.ImageWithContent", "templateLayoutFactory"]}
          options={{
            suppressMapOpenBlock: true,
            yandexMapDisablePoiInteractivity: true,
          }}
          onLoad={(ymapsInstance) => setYmaps(ymapsInstance)}
        >
          {ymaps &&
            shops.map((shop) => (
              <Placemark
                key={shop.id}
                geometry={[shop.lat, shop.lng]}
                onClick={() => setSelectedShop(shop)}
                options={{
                  iconLayout: "default#imageWithContent",
                  iconImageHref: "",
                  iconImageSize: [50, 50],
                  iconImageOffset: [-25, -25],
                  iconContentLayout: ymaps.templateLayoutFactory.createClass(
                    `<div style="
                      width: 50px;
                      height: 50px;
                      border-radius: 50%;
                      background-color: #3EC171;
                      border: 3px solid #3EC171;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      overflow: hidden;
                      box-shadow: 0 0 6px rgba(0,0,0,0.25);
                    ">
                      <img src='${shop.image_url}' style="width: 100%; height: 100%; object-fit: cover;" />
                    </div>`
                  ),
                }}
              />
            ))}
        </Map>
      </YMaps>

      {selectedShop && (
        <div className="absolute bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-2xl p-4 animate-slide-up">
          <div className="flex items-center gap-3">
            <img
              src={selectedShop.image_url}
              alt={selectedShop.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#3EC171]"
            />
            <div>
              <h2 className="text-lg font-semibold">{selectedShop.name}</h2>
              <p className="text-sm text-gray-500">{selectedShop.address}</p>
              <p className="text-sm text-yellow-500">⭐ {selectedShop.rating}</p>
            </div>
          </div>
          <button
            className="mt-3 w-full py-2 bg-[#3EC171] text-white font-medium rounded-lg"
            onClick={() => setSelectedShop(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default YandexAllShopsMap;