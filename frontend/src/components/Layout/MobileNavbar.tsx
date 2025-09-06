import { NavLink } from "react-router-dom";
import { Compass, Search, Heart, CircleUser } from "lucide-react";


const navList = [
  {
    title: "Discover",
    path: "/",
    icon: Compass
  },
  {
    title: "Search",
    path: "/search",
    icon: Search
  },
  {
    title: "Favorites",
    path: "/favorites",
    icon: Heart
  },
  {
    title: "Profile",
    path: "/profile",
    icon: CircleUser
  }

]

const MobileNavbar = () => {

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white shadow-lg rounded-2xl px-4 py-2">
      <ul className="flex justify-between items-center text-sm">
        {
          navList.map(item => {
            return <li>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition ${
                    isActive ? "text-primaryColor bg-primaryColor/10" : "text-zinc-400"
                  }`
                }
              >
                <item.icon className="h-6 w-6"/>
                <span className="text-xs">{item.title}</span>
              </NavLink>
            </li>
          })
        }
        
      </ul>
    </nav>
  );
};

export default MobileNavbar;