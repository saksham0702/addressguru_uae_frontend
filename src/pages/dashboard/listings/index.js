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

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/");
      return;
    }
    get_user_listings().then((res) => {
      if (res) setData(res.listings);
    });
  }, [user, loading]);

  if (loading || !user) return null;

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl p-4">
        <MyListings data={data} />
      </div>
    </DashboardLayout>
  );
};

export default ListingsPage;
