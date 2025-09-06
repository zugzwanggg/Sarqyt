import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, ListOrdered, BarChart3, QrCode } from "lucide-react";

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
    title: "Reports",
    path: "/reports",
    icon: BarChart3,
  },
  {
    title: "Orders",
    path: "/orders",
    icon: ListOrdered,
  }
];

const SellerMobileNavbar = () => {
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white shadow-lg rounded-2xl px-4 py-2">
      <ul className="flex justify-between items-center text-sm">
        {navList.map((item) => (
          <li key={item.path} className={item.isCenter ? "translate-y-[-20%]" : ""}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition ${
                  isActive ? "text-primaryColor bg-primaryColor/10" : "text-zinc-400"
                } ${item.isCenter ? "bg-primaryColor text-white rounded-full p-3 shadow-md" : ""}`
              }
            >
              <item.icon className="h-6 w-6" />
              {!item.isCenter && <span className="text-xs">{item.title}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SellerMobileNavbar;
