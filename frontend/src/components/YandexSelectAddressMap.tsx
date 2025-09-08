import { useState } from "react";
import {
  YMaps,
  Map,
  Placemark,
  GeolocationControl,
  SearchControl,
} from "@pbe/react-yandex-maps";
import { X } from "lucide-react";

type Props = {
  onSelect: (coords: [number, number], address: string) => void;
  onClose: () => void;
  initialCoords?: [number, number];
};

const YandexSelectAddressMap = ({ onSelect, onClose, initialCoords }: Props) => {
  const [coords, setCoords] = useState<[number, number] | null>(
    initialCoords || null
  );
  const [address, setAddress] = useState("");

  const atyrau: [number, number] = [47.0945, 51.9238];
  const kazakhstanBounds = [
    [40.0, 46.0],
    [56.0, 88.0],
  ];

  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://geocode-maps.yandex.ru/1.x/?apikey=${
          import.meta.env.VITE_YANDEX_MAP_API_KEY
        }&format=json&geocode=${lng},${lat}`
      );
      const data = await res.json();
      return (
        data.response.GeoObjectCollection.featureMember[0]?.GeoObject
          ?.metaDataProperty?.GeocoderMetaData?.text || ""
      );
    } catch (e) {
      console.error("Geocode error", e);
      return "";
    }
  };

  const handleCoordsSelect = async (lat: number, lng: number) => {
    const newCoords: [number, number] = [lat, lng];
    setCoords(newCoords);
    const addr = await fetchAddress(lat, lng);
    setAddress(addr);
  };

  const handleClick = (e: any) => {
    const [lat, lng] = e.get("coords");
    handleCoordsSelect(lat, lng);
  };

  const handleSave = () => {
    if (coords && address) {
      onSelect(coords, address);
      onClose();
    }
  };

  return (
    <YMaps query={{ apikey: import.meta.env.VITE_YANDEX_MAP_API_KEY }}>
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Select Location</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 relative">
          <Map
            className="w-full h-full"
            defaultState={{
              center: coords || atyrau,
              zoom: 13,
            }}
            modules={[
              "control.ZoomControl",
              "control.SearchControl",
              "control.GeolocationControl",
            ]}
            onClick={handleClick}
            instanceRef={(map) => {
              if (!map) return;

              map.controls.each((control: any) => {
                if (control.constructor?.name === "SearchControl") {
                  const searchControl = control;
                  searchControl.events.add("resultselect", async (e: any) => {
                    const index = e.get("index");
                    const result = await searchControl.getResult(index);
                    if (result) {
                      const [lng, lat] = result.geometry.getCoordinates();
                      handleCoordsSelect(lat, lng);
                    }
                  });
                }

                if (control.constructor?.name === "GeolocationControl") {
                  const geoControl = control;
                  geoControl.events.add("locationchange", async (e: any) => {
                    const position = e.get("position");
                    if (position && position[0]) {
                      const [lng, lat] = position[0];
                      handleCoordsSelect(lat, lng);
                    }
                  });
                }
              });
            }}
          >
            <SearchControl
              options={{
                float: "right",
                provider: "yandex#search",
                boundedBy: kazakhstanBounds,
                strictBounds: true,
                noPlacemark: true,
              }}
            />
            <GeolocationControl options={{ float: "left" }} />

            {coords && (
              <Placemark
                geometry={coords}
                options={{
                  iconLayout: "default#image",
                  iconImageHref:
                    "https://cdn-icons-png.flaticon.com/512/684/684908.png",
                  iconImageSize: [40, 40],
                  iconImageOffset: [-20, -40],
                }}
              />
            )}
          </Map>
        </div>

        <div className="p-4 border-t">
          <button
            onClick={handleSave}
            disabled={!coords || !address}
            className="bg-primaryColor text-white w-full py-3 rounded-lg disabled:bg-gray-400"
          >
            Save Location
          </button>
        </div>
      </div>
    </YMaps>
  );
};

export default YandexSelectAddressMap;
