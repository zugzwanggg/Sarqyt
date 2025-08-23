import { Link, useNavigate, useParams } from "react-router-dom";
import {useEffect, useState} from "react";

import {ChevronLeft, Heart, Clock, Star, MapPin, ChevronRight, ChevronDown} from "lucide-react";
import { getSarqytById } from "../api/sarqyt";
import type { IExtendedSarqytCard } from "../types";

const Sarqyt = () => {

  const {id} = useParams();
  const nav = useNavigate();

  const [sarqyt, setSarqyt] = useState<IExtendedSarqytCard>();

  const getSarqyt = async () => {
    try {
      const res = await getSarqytById(id!);
      setSarqyt(res);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=> {
    getSarqyt()
  }, [id])

  console.log(sarqyt);
  
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [textCrop, setTextCrop] = useState(true);

  return (
    <div className='pb-28'>
      <div className="relative">
        <span className="absolute w-full h-full bg-gradient-to-b from-transparent to-black/50">
          {/* gradient */}
        </span>
        <img className="aspect-video " src={sarqyt?.image_url} alt={sarqyt?.title} />
        <div className="absolute top-0 left-0 p-4 flex items-center justify-between w-full">
          <button onClick={()=>nav(-1)} className="bg-white rounded-md w-10 h-10 grid place-content-center">
            <ChevronLeft/>
          </button>
          <button onClick={()=>setIsFavorite(prev=>!prev)} className="bg-white rounded-md w-10 h-10 grid place-content-center">
            <Heart className={`${isFavorite ? 'fill-black' : ""}`}/>
          </button>
        </div>
        <div className="absolute bottom-0 left-0 p-4 text-white flex items-center gap-5">
          <Link to={`/shops/${sarqyt?.shop_id}`}>
            <img className="w-16 h-16 rounded-full object-contain bg-white" src={sarqyt?.shop_img} alt="" />
          </Link>
          <h1 className="text-xl">
            {sarqyt?.title}
          </h1>
        </div>
      </div>

      <div className="px-4 mt-4 font-medium flex justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Star size={'1.3rem'} className="text-primaryColor fill-primaryColor "/>
            <span>
              {sarqyt?.rate}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={'1.5rem'} className="text-primaryColor"/>
            <p>
              Collect: <span className="text-nowrap">
              {sarqyt?.pickup_start} - {sarqyt?.pickup_end}
              </span>
            </p>
          </div>
        </div>
        <div>
          <span className="text-zinc-400 line-through text-sm">
            {sarqyt?.original_price}
          </span>
          <h3 className="text-primaryColor text-xl">
            {sarqyt?.discounted_price}
          </h3>
        </div>
      </div>

      <Link to={`/shops/${sarqyt?.shop_id}`} className="flex items-center gap-3 p-4 border-t-2 border-b-2">
        <MapPin className="text-primaryColor"/>
        <div>
          <p className="text-primaryColor leading-4">
            {sarqyt?.address}
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
          {sarqyt?.description}
          <ChevronDown onClick={()=>setTextCrop(prev=>!prev)} className={`absolute right-0 bottom-0 text-primaryColor ${textCrop ? '' : 'hidden'}`}/>
        </p>
        {
          sarqyt?.categories
          ?
          sarqyt?.categories.map(c => {
            return <span className="font-semibold text-sm bg-lightGrayColor py-2 px-4 rounded-2xl">
            {c}
          </span>
          })
          :
          ''
        }
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