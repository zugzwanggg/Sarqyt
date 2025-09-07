import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";

type Props = {
  lat: number | void;
  lng: number | void;
  logo: string | undefined;
};

const YandexSellerMap = ({ lat, lng, logo }: Props) => {
  const atyrauCoordinates = [47.0945, 51.9238];

  if (!lat || !lng) {
    return null;
  }

  return (
    <YMaps>
      <Map
        className="aspect-video"
        defaultState={{ center: atyrauCoordinates, zoom: 13 }}
        modules={["control.ZoomControl"]}
        options={{
          suppressMapOpenBlock: true,
          yandexMapDisablePoiInteractivity: true, 
        }}
      >
        <Placemark
          geometry={[lat, lng]}
          options={{
            iconLayout: "default#image",
            iconImageHref: logo,
            iconImageSize: [40, 40],
            iconImageOffset: [-20, -20],
          }}
        />
      </Map>
    </YMaps>
  );
}

export default YandexSellerMap