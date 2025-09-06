import { Outlet } from "react-router-dom";
import {useState} from "react";

// import Header from "./Header";
// import Sidebar from "./Sidebar";
// import Footer from "./Footer";
import Onboarding from "../Onboarding";
import ChooseLocation from "../ChooseLocation";
import MobileNavbar from "./MobileNavbar";
import { useUser } from "../../context/UserContext";
import SellerMobileNavbar from "./SellerMobileNavbar";


const Layout = () => {

  const {user} = useUser();
  const [onboardingDone, setOnboardingDone] = useState(
    localStorage.getItem('onboardingdone') === "true"
  )

  const onFinish = () => {
    localStorage.setItem('onboardingdone', "true");
    setOnboardingDone(true);
  }

  return (
    <>

      {/* <Header/> */}

      <div className="relative pb-16">

        {
          onboardingDone
          ?
          ''
          :
          <Onboarding onFinish={onFinish}/>
        }

        {
          true
          ?
          ''
          :
          <ChooseLocation/>
        }

        {/* <Sidebar/> */}
        <Outlet/>

        {
          user?.role === 'seller'
          ?
          <SellerMobileNavbar/>
          :
          <MobileNavbar/>
        }
        
      </div>

      {/* <Footer/> */}
    </>
  )
}

export default Layout