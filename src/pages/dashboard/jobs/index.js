// pages/dashboard/jobs.jsx

import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import MyJobListings from "@/components/Dashboard/MyJobListings";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { get_job_listings } from "@/api/uae-dashboard";

export default function JobsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (loading) return;
    if (!user) return router.replace("/");

    get_job_listings().then((res) => {
      if (res) setData(res);
    });
  }, [user, loading]);

  if (loading || !user) return null;

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl p-4">
        <MyJobListings data={data} />
      </div>
    </DashboardLayout>
  );
}
