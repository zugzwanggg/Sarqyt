import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

type Props = {
  lat: number|void;
  lng: number|void;
}

const YandexMap = ({lat,lng}: Props) => {


  const atyrauCoordinates = [47.0945, 51.9238]

  if (!lat || !lng) {
    return null;
  }

  return (
    <YMaps>
      <Map className='aspect-video' defaultState={{center: atyrauCoordinates, zoom: 5}}>
        <Placemark geometry={[lat,lng]}/>
      </Map>
    </YMaps>
  )
}

export default YandexMap