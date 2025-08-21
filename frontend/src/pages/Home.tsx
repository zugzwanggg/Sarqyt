import { useState, useEffect } from "react";
import {LocateFixed} from "lucide-react";
import { Link } from "react-router-dom";
import SarqytCard from "../components/SarqytCard";
import { useUser } from "../context/UserContext";
import { getSarqytCategories, getSarqyts } from "../api/user";
import type { ICategory, ISarqytCard } from "../types";


const Home = () => {
  const [category, setCategory] = useState<number|null>(null);
  const [sarqyts, setSarqyts] = useState<ISarqytCard[]>([]);
  const {user} = useUser();
  const {setIsSelectLocation} = useUser();
  const [categories, setCategories] = useState<ICategory[]>([]);
  
  
  const getCategories = async () => {
    try {

      const res = await getSarqytCategories();

      setCategories(res);

    } catch (error) {
      console.log(error);
    }
  }

  const getSarqytsData = async () => {
    try {

      const data = await getSarqyts(category);
      setSarqyts(data)

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getCategories();
  }, [])

  useEffect(()=> {
    getSarqytsData();
  }, [category])
  

  return (
    <div>
      <div onClick={()=>setIsSelectLocation(true)} className="cursor-pointer flex items-center py-5 gap-4">
        <span className="bg-lightGreen w-10 h-10 grid place-content-center rounded-full">
          <LocateFixed className="text-primaryColor"/>
        </span>
        <div className="flex items-center gap-2 overflow-hidden">
          <p className="font-semibold text-nowrap">
            Chosen Location
          </p>
          <p className="text-nowrap">
            {user?.city||''}
          </p> 
        </div>
      </div>

      <ul className="flex items-center gap-2 overflow-x-auto mb-5">
        <li onClick={()=> setCategory(null)} className={`${category === null ? 'bg-primaryColor text-white' : 'bg-gray-200 text-black'} py-2 px-4 w-fit rounded`}>
          All
        </li>
        {
          categories.map(item => (
            <li onClick={()=> setCategory(item.id)} className={`${category === item.id ? 'bg-primaryColor text-white' : 'bg-gray-200 text-black'} py-2 px-4 w-fit rounded`}>
              <p className="text-nowrap">
                {item.name}
              </p>
            </li>
          ))
        }
      </ul>


      <div className="flex items-center justify-between mb-4">
        <h2>
          Sarqyts in your area
        </h2>
        <Link className="font-semibold text-primaryColor underline underline-offset-1 hover:opacity-50" to="/all?type=city">
          See all
        </Link>
      </div>
      <ul className="flex overflow-x-auto gap-4">
        {
          sarqyts.map(item => {
            return <li className="flex-shrink-0">
              <SarqytCard
                key={item.id}
                id={item.id}
                title={item.title}
                pickup_start={item.pickup_start}
                pickup_end={item.pickup_end}
                image_url={item.image_url}
                quantity_available={item.quantity_available}
                original_price={item.original_price}
                discounted_price={item.discounted_price}
              />
            </li>
          })
        }
        
      </ul>
      
    </div>
  )
}

export default Home