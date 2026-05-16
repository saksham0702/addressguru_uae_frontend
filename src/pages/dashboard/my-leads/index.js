import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import RecentLeads from "@/components/Dashboard/RecentLeads";
import { get_my_leads } from "@/api/uae-dashboard";
import React, { useCallback, useEffect, useState } from "react";
const MyLeads = () => {
  const [leadsData, setLeadsData] = useState([]);

  const getLeads = useCallback(async () => {
    try {
      const res = await get_my_leads();
      console.log("my leads", res?.result);
      if (res?.success) {
        setLeadsData(res?.result);
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
    }
  }, []);

  useEffect(() => {
    getLeads();
  }, [getLeads]);
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="font-semibold text-xl">My Leads</h1>
        <RecentLeads queries={leadsData} />
      </div>
    </DashboardLayout>
  );
};

export default MyLeads;