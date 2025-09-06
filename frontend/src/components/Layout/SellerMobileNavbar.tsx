import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, ListOrdered, Settings, QrCode } from "lucide-react";

const navList = [
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
  {
    title: "Scanner",
    path: "/scanner",
    icon: QrCode,
    isCenter: true,
  },
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
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full min-w-[300px] max-w-sm bg-white shadow-lg rounded-2xl px-2 py-2">
      <ul className="flex justify-between items-center text-sm">
        {navList.map((item) => (
          <li key={item.path} className={`flex-1 text-center ${item.isCenter ? "relative" : ""}`}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition ${
                  isActive && !item.isCenter
                    ? "text-primaryColor bg-primaryColor/10"
                    : "text-zinc-400"
                } ${
                  item.isCenter
                    ? "absolute -top-6 left-1/2 -translate-x-1/2 bg-primaryColor text-white rounded-full p-4 shadow-lg"
                    : ""
                }`
              }
            >
              <item.icon className={`${item.isCenter ? "h-8 w-8 text-white" : "h-6 w-6"}`} />
              {!item.isCenter && <span className="text-xs">{item.title}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SellerMobileNavbar;