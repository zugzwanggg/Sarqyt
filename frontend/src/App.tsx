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
        <Route path="/" element={<Home/>}/>
        <Route path="/search" element={<Search/>}/>
        <Route path="/favorites" element={<Favorites/>}/>
        <Route path="/profile" element={<Profile/>}/>
      </Route>

      <Route path="/sarqyts/:id" element={<Sarqyt/>}/>
      <Route path="/shops/:id" element={<Shop/>}/>
    </Routes>
  )
}

export default App
