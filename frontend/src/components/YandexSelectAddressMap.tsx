import { useEffect, useRef, useState } from "react";
import {
  YMaps,
  Map,
  Placemark,
  GeolocationControl,
  SearchControl,
} from "@pbe/react-yandex-maps";

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
  const mapRef = useRef<HTMLDivElement>(null);

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
        data.response.GeoObjectCollection.featureMember[0].GeoObject
          .metaDataProperty.GeocoderMetaData.text || ""
      );
    } catch (e) {
      console.error("Geocode error", e);
      return "";
    }
  };

  const handleClick = async (e: any) => {
    const newCoords: [number, number] = e.get("coords");
    setCoords(newCoords);
    const addr = await fetchAddress(newCoords[0], newCoords[1]);
    setAddress(addr);
    onSelect(newCoords, addr);
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (mapRef.current && !mapRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  return (
    <YMaps query={{ apikey: import.meta.env.VITE_YANDEX_MAP_API_KEY }}>
      <div ref={mapRef} className="relative bg-white rounded-xl shadow-lg p-2">
        <div className="text-sm text-gray-700 mb-2">
          {coords ? `Selected: ${address}` : "Click on the map to select address"}
        </div>

        <Map
          className="w-full h-[500px] rounded-lg"
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
        >
          <SearchControl
            options={{
              float: "right",
              provider: "yandex#search",
              boundedBy: kazakhstanBounds,
              strictBounds: true,
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
    </YMaps>
  );
};

export default YandexSelectAddressMap;