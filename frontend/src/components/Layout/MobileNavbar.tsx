import { NavLink } from "react-router-dom";
import { Compass, Search, Heart, CircleUser } from "lucide-react";
import { useTranslation } from "react-i18next";

const MobileNavbar = () => {
  const { t } = useTranslation();

  const navList = [
    { title: t("Discover"), path: "/", icon: Compass },
    { title: t("Search"), path: "/search", icon: Search },
    { title: t("Favorites"), path: "/favorites", icon: Heart },
    { title: t("Profile"), path: "/profile", icon: CircleUser },
  ];

  return (
    <nav className="fixed z-40 bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white shadow-lg rounded-2xl px-4 py-2">
      <ul className="flex justify-between items-center text-sm">
        {navList.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition ${
                  isActive
                    ? "text-primaryColor bg-primaryColor/10"
                    : "text-zinc-400"
                }`
              }
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs">{item.title}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MobileNavbar;