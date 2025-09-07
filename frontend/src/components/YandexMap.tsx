import { YMaps, Map } from '@pbe/react-yandex-maps';

type Props = {
  lat: number|void;
  lng: number|void;
}

const YandexMap = ({lat,lng}: Props) => {

  if (!lat || !lng) {
    lat = 47.09;
    lng = 51.92;
  }

  return (
    <YMaps>
      <Map className='aspect-video' defaultState={{center: [lat, lng], zoom: 8}}/>
    </YMaps>
  )
}

export default YandexMap