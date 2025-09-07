import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { useState } from "react";

type Props = {
  lat: number | void;
  lng: number | void;
  logo: string | undefined;
};

const YandexSellerMap = ({ lat, lng, logo }: Props) => {
  const atyrauCoordinates = [47.0945, 51.9238];
  const [ymaps, setYmaps] = useState<any>(null);

  const YANDEX_MAP_API = import.meta.env.VITE_YANDEX_MAP_API_KEY;

  if (!lat || !lng) {
    return null;
  }

  return (
    <YMaps query={{ lang: "en_US" , apikey: YANDEX_MAP_API}}>
      <Map
        className="aspect-video"
        defaultState={{ center: atyrauCoordinates, zoom: 13 }}
        modules={[
          "control.ZoomControl",
          "layout.ImageWithContent",
          "templateLayoutFactory"
        ]}
        options={{
          suppressMapOpenBlock: true,
          yandexMapDisablePoiInteractivity: true,
        }}
        onLoad={(ymapsInstance) => setYmaps(ymapsInstance)}
      >
        {ymaps && (
          <Placemark
            geometry={[lat, lng]}
            options={{
              iconLayout: "default#imageWithContent",
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
                  <img src='${logo}' style="width: 100%; height: 100%; object-fit: cover;" />
                </div>`
              ),
            }}
          />
        )}
      </Map>
    </YMaps>
  );
};

export default YandexSellerMap;