import { Outlet } from "react-router-dom";
import {useState} from "react";

// import Header from "./Header";
// import Sidebar from "./Sidebar";
// import Footer from "./Footer";
import Onboarding from "../Onboarding";
import ChooseLocation from "../ChooseLocation";
import MobileNavbar from "./MobileNavbar";


const Layout = () => {

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

        <MobileNavbar/>
      </div>

      {/* <Footer/> */}
    </>
  )
}

export default Layout