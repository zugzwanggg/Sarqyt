import {useEffect, useState} from "react";
import {Check, ChevronLeft} from "lucide-react";
import {Search} from "lucide-react";
import type { ICity } from "../types";
import { api } from "../App";
import { useTelegramLogin } from "../hooks/useTelegramLogin";

const ChooseLocation = () => {

  const {user} = useTelegramLogin();
  const [city, setCity] = useState<null|number>(null);
  const [searchValue, setSearchValue] = useState('');
  const [cities, setCities] = useState<ICity[]>([]);
 
  const getCities = async () => {
    const data = (await api.get('/api/cities')).data;
    setCities(data)
  }

  useEffect(()=> {
    getCities();
  }, [])

  const handleSelectAddress = (id:number, value:string) => {
    setCity(id)
    setSearchValue(value)
  }

  const saveUserAddress = async () => {
    try {
      await api.patch('/api/user/city', {
        cityId: city
      })
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div className='px-4 fixed w-full h-full left-0 top-0 bg-white'>
      <div className="relative py-5 w-full">
        {
          !user
          ?
          ''
          :
          <button>
            <ChevronLeft className="text-grayColor" size={'2rem'} />
          </button>
        }
        <h2 className="left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 absolute text-center">
          Choose location
        </h2>
      </div>

      <label className="flex items-center gap-4 py-2 w-full bg-lightGrayColor rounded px-4" htmlFor="newaddress">
        <span>
          <Search size={'1.5rem'}/>
        </span>
        <div className="w-0.5 h-7 bg-grayColor">
          {/* line */}
        </div>
        <div className="flex flex-col">
          <small className="text-zinc-400">
            City
          </small>
          <input onChange={(e)=>setSearchValue(e.target.value)} value={searchValue} autoFocus={true} className="bg-transparent outline-none" id="newaddress" type="text" placeholder="Your city" />
        </div>
        {
          city
          ?
          <button onClick={saveUserAddress} className="bg-primaryColor text-white p-2 rounded-md">
            <Check/>
          </button>
          :
          ''
        }
      </label>

      <ul className="mt-4">
        {
          cities.map(item => {
            return <li key={item.id} onClick={()=>handleSelectAddress(item.id, item.name)} className="py-4">
              <p>
                {item.name}
              </p>
            </li>
          })
        }
      </ul>
    </div>
  )
}

export default ChooseLocation