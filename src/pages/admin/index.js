import AdminDashboard from "@/components/admin/dashboar";
import SideNav from "@/components/admin/sidebar/sidebar";
import Sidebar from "@/components/Sidebar";
import React from "react";

function Admin() {

   
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
