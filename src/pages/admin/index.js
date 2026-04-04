import AdminDashboard from "@/components/admin/dashboar";
import SideNav from "@/components/admin/sidebar/sidebar";
import Sidebar from "@/components/Sidebar";
import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

function Admin() {
  const { user } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.replace("/");
    }
  }, []);
    // if user role is not 1 redirect to home page
  useEffect(() => {
    if (user && user.roles && !user.roles.includes(1) ) {
      localStorage.removeItem("token");
      router.replace("/");
    }
  }, [user]);

   
  return (
    <>
      <div className="min-h-screen w-full">
        <div className="w-full  ">
          <AdminDashboard />
        </div>
      </div>
    </>
  );
}

export default Admin;
