import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout/Layout";
// pages
import Home from "./pages/Home";
import Sarqyt from "./pages/Sarqyt";
import Search from "./pages/Search";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import Shop from "./pages/Shop";

import axios from 'axios';
import { Loader2 } from "lucide-react";
import ChooseLocation from "./components/ChooseLocation";

import { useUser } from "./context/UserContext";
import SettingsPage from "./pages/Settings";
import OrderPage from "./pages/OrderPage";
import SeeAll from "./pages/SeeAll";
import QRScanner from "./pages/Scanner";
import Dashboard from "./pages/Dashboard";
import ProductsPage from "./pages/Products";
import ProductDetailsPage from "./pages/ProductPage";
import SellerOrdersPage from "./pages/SellerOrders";


import './i18n';

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  withCredentials: true,
});



api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function App() {
  const {user, loading, isSelectLocation} = useUser();
  if (loading) {
    return <div className="bg-primaryColor w-full h-screen flex items-center justify-center text-white">
      <Loader2 size={'4rem'} className="animate-spin"/>
    </div>
  }

  if (!user?.city || isSelectLocation) {
    return <ChooseLocation/>
  }

  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        {/* User */}
        <Route path="/" element={<Home/>}/>
        <Route path="/search" element={<Search/>}/>
        <Route path="/favorites" element={<Favorites/>}/>
        <Route path="/profile" element={<Profile/>}/>
        
        {/* Seller */}
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/products" element={<ProductsPage/>}/>
        <Route path="/orders" element={<SellerOrdersPage/>}/>
      </Route>

      <Route path="/sarqyts/:id" element={<Sarqyt/>}/>
      <Route path="/shops/:id" element={<Shop/>}/>
      <Route path="/settings" element={<SettingsPage/>}/>
      <Route path="/orders/:id" element={<OrderPage/>}/>
      <Route path="/all" element={<SeeAll/>}/>

      {/* seller */}
      <Route path="/scanner" element={<QRScanner/>}/>
      <Route path="/products/:shopId/:productId" element={<ProductDetailsPage/>}/>
    </Routes>
  )
}

export default App
