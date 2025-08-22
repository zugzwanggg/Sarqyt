import { ChevronLeft, MapPin, Cake } from "lucide-react";
import { data, useNavigate, useParams } from "react-router-dom";
import ShopSarqytCard from "../components/ShopSarqytCard";
import {useState, useEffect} from "react";
import type { IShop } from "../types";
import { getShopById } from "../api/shop";

const Shop = () => {
  const {id} = useParams();
  const nav = useNavigate();

  const [shop, setShop] = useState<IShop|null>(null);

  const getShop =async () => {
    try {

      const data = await getShopById(id!);
      setShop(data)

    } catch (error) {
      console.log(error);
    }
  }

  console.log(data);

  useEffect(() => {
    getShop();
  }, [id])
  

  return (
    <div className="bg-lightGrayColor">
      <div className="p-4 bg-white">
        <button onClick={()=>nav(-1)}>
          <ChevronLeft size={'2rem'} className="text-black"/>
        </button>
      </div>

      <div className="px-4 border-b-2 pb-4 bg-white">
        <div className="flex items-center gap-5">
          <img className="w-16 h-16 rounded-full object-contain bg-white border-2 border-zinc-300" src={shop?.image_url} alt={shop?.name} />
          <h1 className="text-xl">
            {shop?.name}
          </h1>
        </div>
      </div>
      <div className="p-4 flex items-center text-primaryColor gap-2 bg-white pb-7">
        <MapPin size={'1rem'}/>
        <p className="text-lg">
          {shop?.address}
        </p>
      </div>

      <div className="mt-4 p-4 bg-white">
        <h2 className="mb-4">
          Sarqyts from this store
        </h2>
        <ul className="flex gap-4 overflow-x-scroll pb-4">
          <li className="flex-shrink-0">
            <ShopSarqytCard/>
          </li>
          <li className="flex-shrink-0">
            <ShopSarqytCard/>
          </li>
        </ul>
      </div>

      <div className="p-4 mt-4 bg-white">
        <h2 className="mb-4">
          About
        </h2>
        <div className="flex items-center justify-evenly">
          <div className="flex flex-col items-center font-bold gap-2 w-1/2">
            <div className="bg-blue-400 p-4 rounded-full w-fit border-2 border-black">
              <Cake/>
            </div>
            <span className="text-sm">
              5 years
            </span>
            <p className="text-sm text-center">
              Fighting food waste
            </p>
          </div>

          <div className="flex flex-col items-center font-bold gap-2 w-1/2">
            <div className="bg-primaryColor p-4 rounded-full w-fit border-2 border-black">
              <Cake/>
            </div>
            <span className="text-sm">
              1000+
            </span>
            <p className="text-sm">
              Meals Saved
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shop