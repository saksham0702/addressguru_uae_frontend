"use client";
import { get_user_details } from "@/api/uaeadminlogin";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [city, setCity] = useState("dubai");
  const [admin, setAdmin] = useState(null);

  // fetch user using token
  const fetchUser = async (authToken) => {
    if (!authToken) return;
    const userData = await get_user_details(authToken);
    if (userData) {
      setUser(userData);
    } else {
      // ✅ Bad/error response → wipe everything out
      setUser(null);
      setToken(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("token");
      }
    }
  };



  // load token and city on first mount
  useEffect(() => {
    if (typeof window === "undefined") {
      setIsLoaded(true);
      return;
    }
    const savedToken = localStorage.getItem("authToken");
    const savedCity = localStorage.getItem("city");
    if (savedToken) setToken(savedToken);
    if (savedCity) setCity(savedCity);
    setIsLoaded(true);
  }, []);

  // whenever token changes → reload user
  useEffect(() => {
    if (token) {
      fetchUser(token);
    } else {
      setUser(null);
    }
  }, [token]);

  // persist city when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("city", city);
    }
  }, [city]);

  const login = async (newToken) => {
    setToken(newToken);
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", newToken);
    }
    await fetchUser(newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
    }
  };

  if (!isLoaded) return null;

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        user,
        setUser,
        login,
        logout,
        isLoaded,
        city,
        setCity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
