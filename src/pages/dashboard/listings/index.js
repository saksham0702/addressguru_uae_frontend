import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import MyListings from "@/components/Dashboard/MyListings";
import ListingFeaturesPanel from "@/components/Dashboard/ListingFeaturesPanel";
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
    if (!user) {
      router.replace("/");
      return;
    }
    fetchListings();
  }, [user, loading]);

  if (loading || !user) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <MyListings data={data} onRefresh={fetchListings} />
        <ListingFeaturesPanel />
      </div>
    </DashboardLayout>
  );
};

export default ListingsPage;
