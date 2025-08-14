import {useEffect, useState} from "react";
import {ChevronLeft, Loader2} from "lucide-react";
import {Search} from "lucide-react";
import type { ICity } from "../types";
import { api } from "../App";
import { useTelegramLogin } from "../hooks/useTelegramLogin";
import { getMe } from "../api/auth";

const ChooseLocation = () => {

  const {user} = useTelegramLogin();
  const [city, setCity] = useState<null|number>(null);
  const [searchValue, setSearchValue] = useState('');
  const [cities, setCities] = useState<ICity[]>([]);
  const [isLoading, setIsLoading] = useState(false);


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

  const saveUserCity = async () => {
    setIsLoading(true)
    try {
      await api.patch('/api/user/city',{
        cityId: city,
      }
      )
      getMe();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false)
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
      </label>

      <ul className="py-4">
        {
          cities.filter(item=> item.name.toLowerCase() !== searchValue.toLowerCase()).map(item => {
            return <li key={item.id} onClick={()=>handleSelectAddress(item.id, item.name)} className={`p-4 border-2 rounded-md mb-2 ${user?.city === item.id || city === item.id ? 'text-primaryColor border-primaryColor' : 'border-zinc-400'}`}>
              <p>
                {item.name}
              </p>
            </li>
          })
        }
      </ul>

      <div className="fixed w-full bg-white left-0 bottom-0 border-t-2 px-4 py-6">
        <button onClick={saveUserCity} className="w-full bg-primaryColor text-white rounded-2xl p-3">
          {
            isLoading
            ?
            <Loader2 size={'1rem'} className="text-white animate-spin"/>
            :
            'Apply'
          }
        </button>
      </div>
    </div>
  )
}

export default ChooseLocation