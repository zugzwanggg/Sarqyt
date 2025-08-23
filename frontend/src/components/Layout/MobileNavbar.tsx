import { NavLink } from "react-router-dom";
import { Compass, Search, Heart, CircleUser } from "lucide-react";

const MobileNavbar = () => {
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white shadow-lg rounded-2xl px-4 py-2">
      <ul className="flex justify-between items-center text-sm">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition ${
                isActive ? "text-primaryColor bg-primaryColor/10" : "text-zinc-400"
              }`
            }
          >
            <Compass className="h-6 w-6" />
            <span className="text-xs">Discover</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition ${
                isActive ? "text-primaryColor bg-primaryColor/10" : "text-zinc-400"
              }`
            }
          >
            <Search className="h-6 w-6" />
            <span className="text-xs">Search</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition ${
                isActive ? "text-primaryColor bg-primaryColor/10" : "text-zinc-400"
              }`
            }
          >
            <Heart className="h-6 w-6" />
            <span className="text-xs">Favorites</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition ${
                isActive ? "text-primaryColor bg-primaryColor/10" : "text-zinc-400"
              }`
            }
          >
            <CircleUser className="h-6 w-6" />
            <span className="text-xs">Profile</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default MobileNavbar;