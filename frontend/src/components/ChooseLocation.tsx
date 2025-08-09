import {useState} from "react";
import {ChevronLeft} from "lucide-react";
import {Search} from "lucide-react";

const ChooseLocation = () => {

  const [address, setAddress] = useState('');


  return (
    <div className='px-4 fixed w-full h-full left-0 top-0 bg-white'>
      <div className="relative py-5 w-full">
        <button>
          <ChevronLeft className="text-grayColor" size={'2rem'} />
        </button>
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
            New address
          </small>
          <input onChange={(e)=>setAddress(e.target.value)} value={address} autoFocus={true} className="bg-transparent outline-none" id="newaddress" type="text" placeholder="Your address" />
        </div>
      </label>
    </div>
  )
}

export default ChooseLocation