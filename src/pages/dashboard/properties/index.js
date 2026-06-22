// pages/dashboard/properties.jsx

import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import MyPropertyListings from "@/components/Dashboard/MyProperties";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { get_property_listings } from "@/api/uae-dashboard";

export default function PropertiesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (loading) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!user && !token) {
      router.replace("/");
      return;
    }

    get_property_listings().then((res) => {
      if (res) setData(res);
    });
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl p-4">
        <MyPropertyListings data={data} />
      </div>
    </DashboardLayout>
  );
}
