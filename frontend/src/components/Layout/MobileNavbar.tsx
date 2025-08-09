import { NavLink } from "react-router-dom";
import {Compass} from "lucide-react";
import {Search} from "lucide-react";
import {Heart} from "lucide-react";
import {CircleUser} from "lucide-react";

const MobileNavbar = () => {
  return (
    <nav className="fixed pt-3 bg-white border border-2-grayColor bottom-0 left-0 w-full">
      <ul className="grid grid-cols-4 ">
        <li className="place-self-center">
          <NavLink to='/' className={({isActive}) => `${isActive ? 'text-primaryColor text-center' : 'text-zinc-400'}`}>
            <Compass className="mx-auto"/>
            Discover
          </NavLink>
        </li>
        <li className="place-self-center">
          <NavLink to='/search' className={({isActive}) => `${isActive ? 'text-primaryColor text-center' : 'text-zinc-400'}`}>
            <Search className="mx-auto"/>
            Search
          </NavLink>
        </li>
        <li className="place-self-center">
          <NavLink to='/favorites' className={({isActive}) => `${isActive ? 'text-primaryColor text-center' : 'text-zinc-400'}`}>
            <Heart className="mx-auto"/>
            Favorites
          </NavLink>
        </li>
        <li className="place-self-center">
          <NavLink to='/profile' className={({isActive}) => `${isActive ? 'text-primaryColor text-center' : 'text-zinc-400'}`}>
            <CircleUser className="mx-auto"/>
            Profile
          </NavLink>
        </li>
      </ul>
    </nav>  
  )
}

export default MobileNavbar