import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { useRef} from "react";

type Props = {
  lat: number | void;
  lng: number | void;
  logo: string | undefined;
};

const YandexSellerMap = ({ lat, lng, logo }: Props) => {
  const atyrauCoordinates = [47.0945, 51.9238];
  const placemarkRef = useRef<any>(null);

  if (!lat || !lng) {
    return null;
  }

  return (
    <YMaps query={{ lang: "en_US" }}>
      <Map
        className="aspect-video"
        defaultState={{ center: atyrauCoordinates, zoom: 13 }}
        modules={["templateLayoutFactory", "control.ZoomControl"]}
        options={{
          suppressMapOpenBlock: true,
          yandexMapDisablePoiInteractivity: true,
        }}
      >
        <Placemark
          geometry={[lat, lng]}
          instanceRef={(ref) => {
            if (ref && (window as any).ymaps) {
              const ymaps = (window as any).ymaps;
              const layout = ymaps.templateLayoutFactory.createClass(
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
              );
              ref.options.set("iconLayout", "default#imageWithContent");
              ref.options.set("iconContentLayout", layout);
              ref.options.set("iconImageSize", [50, 50]);
              ref.options.set("iconImageOffset", [-25, -25]);
            }
            placemarkRef.current = ref;
          }}
        />
      </Map>
    </YMaps>
  );
};

export default YandexSellerMap;