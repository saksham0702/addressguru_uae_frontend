import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import MyListings from "@/components/Dashboard/MyListings";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { get_user_listings } from "@/api/uae-dashboard";

const ListingsPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState([]);

  const fetchListings = () => {
    get_user_listings().then((res) => {
      if (res) setData(res.listings);
    });
  };

  useEffect(() => {
    if (loading) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!user && !token) {
      router.replace("/");
      return;
    }
    fetchListings();
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <MyListings data={data} onRefresh={fetchListings} />
      </div>
    </DashboardLayout>
  );
};

export default ListingsPage;
