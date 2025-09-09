import { useState } from "react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { Navigation } from "lucide-react";
import type { IShop } from "../types";
import { useNavigate } from "react-router-dom";

type Props = {
  shops: IShop[];
};

const YandexAllShopsMap = ({ shops }: Props) => {
  const [selectedShop, setSelectedShop] = useState<IShop | null>(null);
  const [ymaps, setYmaps] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const nav = useNavigate();

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setUserLocation(coords);

          if (ymaps) {
            ymaps.setCenter(coords, 14, { duration: 500 });
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to get your location");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  return (
    <div className="fixed top-0 w-screen h-screen overflow-hidden">
      {/* Map */}
      <YMaps>
        <Map
          className="absolute inset-0 w-full h-full"
          defaultState={{
            center: [47.0945, 51.9238],
            zoom: 12,
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
          {userLocation && (
            <Placemark
              geometry={userLocation}
              options={{
                preset: "islands#circleIcon",
                iconColor: "#FF5722",
              }}
            />
          )}
        </Map>
      </YMaps>

      <button
        onClick={handleGetLocation}
        className="absolute bottom-28 right-5 z-50 p-3 bg-white rounded-full shadow-lg flex items-center justify-center"
      >
        <Navigation className="w-6 h-6 text-[#3EC171]" />
      </button>

      {/* Shop info panel */}
      {selectedShop && (
        <div onClick={()=>nav(`/shops/${selectedShop.id}`)} className="absolute z-50 bottom-28 left-0 right-0 bg-white shadow-lg rounded-t-2xl p-4 animate-slide-up">
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
