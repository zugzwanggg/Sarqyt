import { Outlet } from "react-router-dom";

import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";


const Layout = () => {
  return (
    <>

      <Header/>

      <div>
        <Sidebar/>
        <Outlet/>
      </div>

      <Footer/>
    </>
  )
}

export default Layout