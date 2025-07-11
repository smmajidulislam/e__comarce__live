"use client";
import Carosel from "./components/home/Carosel";
import Feature from "./components/home/Feature";
import NewArrivals from "./components/home/NewArrivals";
import Products from "./components/home/Products";
import TopAd from "./components/home/TopAd";
import NewArrivalProducts from "./components/home/NewArrivalProducts";
import { useAuth } from "./hooks/UseAuth";
import { useEffect } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const { token, logout } = useAuth();
  useEffect(() => {
    if (token?.role === true) {
      toast.error(
        "You are admin. please login from admin panel or visit as a user."
      );
      const handleLogout = async () => {
        await logout("home");
      };
      handleLogout();
    }
  }, [token]);
  return (
    <div className="font inter">
      <Carosel />
      <TopAd />
      <Feature />
      <Products />
      <NewArrivals />
      <NewArrivalProducts />
    </div>
  );
};

export default Page;
