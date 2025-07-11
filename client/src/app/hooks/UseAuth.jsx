"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useLogOutMutation } from "../features/auth/authApi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logOut] = useLogOutMutation();
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(JSON.parse(storedToken));
    setLoading(false);
  }, []);

  const savetoken = (newToken, time) => {
    setLoading(true);
    if (time) {
      localStorage.setItem("token", JSON.stringify(newToken));
      setToken(newToken);
    } else {
      localStorage.setItem("token", JSON.stringify(newToken));
      setToken(newToken);
      setTimeout(() => {
        localStorage.removeItem("token");
        setToken(null);
      }, 24 * 60 * 60 * 1000);
    }
    setLoading(false);
  };

  const logout = async (isAdmin) => {
    setLoading(true);
    const result = await logOut().unwrap();
    if (result?.ok) {
      localStorage.removeItem("token");
      toast.success("Logout successfully");
      if (!isAdmin) {
        router.push("/login");
      } else if (isAdmin === "home") {
        router.push("/");
      } else {
        router.push("/admin");
      }
    }
    setToken(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ token, loading, savetoken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
