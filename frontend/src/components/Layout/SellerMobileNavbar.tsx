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
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] min-w-[300px] max-w-sm bg-white shadow-lg rounded-2xl px-2 py-2">
      <ul className="flex justify-around items-center text-xs md:text-sm">
        {navList.map((item, index) => {
          // Split nav into left/right, leave center empty for QR
          if (index === 2) {
            return <li key="spacer" className="flex-1" />; // spacer in the middle
          }
          return (
            <li key={item.path} className="flex-1 text-center">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition ${
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
          );
        })}
      </ul>

      {/* Floating QR Button */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2">
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
