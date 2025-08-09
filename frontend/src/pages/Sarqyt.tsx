import { Link, useNavigate, useParams } from "react-router-dom";
import {useState} from "react";

import {ChevronLeft, Heart, Clock, Star, MapPin, ChevronRight, ChevronDown} from "lucide-react";

const sarqyt = {
  "id":1,
  "shop_id":1,
  "title":"Surprise Doner Combo",
  "original_price":"1500.00",
  "discounted_price":"500.00",
  "quantity_available":10,
  "pickup_start":"18:00",
  "pickup_end":"20:00",
  "available_until":"2025-07-24 15:16:34.339331",
  "image_url":"https://wallpaperaccess.com/full/9986536.jpg",
  "created_at":"2025-07-23 15:16:34.339331",
  "shop_img": "https://img.postershop.me/10397/Config/257652_1698210458.4511_original.png",
  "rate": 3.5,
  "address": "Satpaeve 25B, 84. 2-room office",
  "description": "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolorum, doloribus libero ipsam eum voluptates, assumenda nihil possimus accusantium est suscipit a adipisci ex distinctio omnis sint consequatur! Cumque est, rerum cupiditate inventore illum necessitatibus perferendis saepe vel provident, perspiciatis optio at, incidunt ab eaque expedita mollitia tempore laudantium placeat itaque ex facilis! Nobis nulla quidem pariatur velit officia quis cum corrupti et. Ut, unde quidem! dsfafds adsf",
  "category": "Meals"
}

const Sarqyt = () => {

  const {id} = useParams();
  console.log(id);
  const nav = useNavigate();
  
  const [isFavorite, setIsFavorite] = useState(false);

  const [textCrop, setTextCrop] = useState(true);

  return (
    <div className='pb-28'>
      <div className="relative">
        <span className="absolute w-full h-full bg-gradient-to-b from-transparent to-black/50">
          {/* gradient */}
        </span>
        <img className="aspect-video " src={sarqyt.image_url} alt={sarqyt.title} />
        <div className="absolute top-0 left-0 p-4 flex items-center justify-between w-full">
          <button onClick={()=>nav(-1)} className="bg-white rounded-md w-10 h-10 grid place-content-center">
            <ChevronLeft/>
          </button>
          <button onClick={()=>setIsFavorite(prev=>!prev)} className="bg-white rounded-md w-10 h-10 grid place-content-center">
            <Heart className={`${isFavorite ? 'fill-black' : ""}`}/>
          </button>
        </div>
        <div className="absolute bottom-0 left-0 p-4 text-white flex items-center gap-5">
          <Link to={`/shops/${sarqyt.shop_id}`}>
            <img className="w-16 h-16 rounded-full object-contain bg-white" src={sarqyt.shop_img} alt="" />
          </Link>
          <h1 className="text-xl">
            {sarqyt.title}
          </h1>
        </div>
      </div>

      <div className="px-4 mt-4 font-medium flex justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Star size={'1.3rem'} className="text-primaryColor fill-primaryColor "/>
            <span>
              {sarqyt.rate}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={'1.5rem'} className="text-primaryColor"/>
            <p>
              Collect: <span className="text-nowrap">
              {sarqyt.pickup_start} - {sarqyt.pickup_end}
              </span>
            </p>
          </div>
        </div>
        <div>
          <span className="text-zinc-400 line-through text-sm">
            {sarqyt.original_price}
          </span>
          <h3 className="text-primaryColor text-xl">
            {sarqyt.discounted_price}
          </h3>
        </div>
      </div>

      <Link to={`/shops/${sarqyt.shop_id}`} className="flex items-center gap-3 p-4 border-t-2 border-b-2">
        <MapPin className="text-primaryColor"/>
        <div>
          <p className="text-primaryColor leading-4">
            {sarqyt.address}
          </p>
          <span className="text-sm text-zinc-500">
            More information about the store
          </span>
        </div>
        <ChevronRight className="text-primaryColor"/>
      </Link>

      <div className="p-4">
        <h2>
          What you could get
        </h2>
        <p className={`relative mb-6 pr-6 ${textCrop ? 'line-clamp-6' : ''}`}>
          {sarqyt.description}
          <ChevronDown onClick={()=>setTextCrop(prev=>!prev)} className={`absolute right-0 bottom-0 text-primaryColor ${textCrop ? '' : 'hidden'}`}/>
        </p>
        <span className="font-semibold text-sm bg-lightGrayColor py-2 px-4 rounded-2xl">
          {sarqyt.category}
        </span>
      </div>


      <div className="fixed w-full bg-white left-0 bottom-0 border-t-2 px-4 py-6">
        <button className="w-full bg-primaryColor text-white rounded-2xl p-3">
          Reserve
        </button>
      </div>
    </div>
  )
}

export default Sarqyt