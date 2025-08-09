import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";


const SearchBar = () => {

  const [isFilterOpen, setIsFilterOpen] = useState(false);


  return (
    <div className="w-full">

      {
        isFilterOpen
        ?
        <div>
          
        </div>
        :
        ''
      }

      <div className="flex items-center justify-between gap-4 mt-4">
        <form className="relative px-2 py-3 border-2 rounded-md w-full">
          <Search size={'1.5rem'} className="absolute left-4 text-zinc-400"/>
          <input className="pl-10 outline-none placeholder:text-zinc-400" type="text" placeholder="Search..." />
        </form>
        <button onClick={()=>setIsFilterOpen(prev=>!prev)} className="border-2 p-3 rounded-md text-primaryColor">
          <SlidersHorizontal/>
        </button>
      </div>
      
    </div>
  )
}

export default SearchBar;