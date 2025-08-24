import { useEffect, useState } from "react";
import SarqytCard from "../components/SarqytCard";
import SearchBar from "../components/SearchBar";
import { getSarqyts } from "../api/sarqyt";
import type { ISarqytCard } from "../types";


const Search = () => {

  const [sarqyts, setSarqyts] = useState<ISarqytCard[]>([])


  const getSarqytsData = async () => {
    try {
      
      const data = await getSarqyts(null);
      setSarqyts(data);

    } catch (error) {
      console.log(error);
    }
  }


  useEffect(()=> {
    getSarqytsData()
  }, [])



  return (
    <div className="px-4 ">
      <SearchBar onSearch={()=>console.log('')}/>

      <ul className="flex flex-col mt-10 gap-4">
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
                isFavorite={item.isFavorite}
                getSarqytsData={getSarqytsData}
                
              />
              
            </li>
          })
        }
        
      </ul>
    </div>
  )
}

export default Search