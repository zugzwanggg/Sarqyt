import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, ListOrdered, Settings, QrCode } from "lucide-react";

const navListLeft = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    path: "/products",
    icon: Package,
  },
];

const navListRight = [
  {
    title: "Orders",
    path: "/orders",
    icon: ListOrdered,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

const SellerMobileNavbar = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white shadow-md px-2 py-2">
      <ul className="flex gap-4 justify-between items-center text-xs md:text-sm">
        <div className="flex flex-1 justify-evenly">
          {navListLeft.map((item) => (
            <li key={item.path} className="text-center">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-2 py-2 transition ${
                    isActive ? "text-primaryColor" : "text-zinc-400"
                  }`
                }
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs">{item.title}</span>
              </NavLink>
            </li>
          ))}
        </div>

        <div className="flex flex-1 justify-evenly">
          {navListRight.map((item) => (
            <li key={item.path} className="text-center">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-2 py-2 transition ${
                    isActive ? "text-primaryColor" : "text-zinc-400"
                  }`
                }
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs">{item.title}</span>
              </NavLink>
            </li>
          ))}
        </div>
      </ul>

      <div className="absolute -top-8 left-1/2 -translate-x-1/2">
        <NavLink
          to="/scanner"
          className="bg-primaryColor text-white rounded-full p-4 shadow-lg flex items-center justify-center"
        >
          <QrCode className="h-8 w-8 text-white" />
        </NavLink>
      </div>
    </nav>
  );
};

export default SellerMobileNavbar;
