// pages/dashboard/marketplace.jsx

import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import MyMarketplaceListings from "@/components/Dashboard/MyMarketplace";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { get_marketplace_listings } from "@/api/uae-dashboard";

export default function MarketplacePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (loading) return;
    if (!user) return router.replace("/");

    get_marketplace_listings().then((res) => {
      if (res) setData(res);
    });
  }, [user, loading]);

  if (loading || !user) return null;

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl p-4">
        <MyMarketplaceListings data={data} />
      </div>
    </DashboardLayout>
  );
}