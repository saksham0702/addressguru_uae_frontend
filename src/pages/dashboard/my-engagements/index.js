import React from "react";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import ListingFeaturesPanel from "@/components/Dashboard/ListingFeaturesPanel";

const MyEngagements = () => {
  return (
    <DashboardLayout>
      <div className="max-w-8xl mx-auto space-y-6">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">My Engagements</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your ownership claims and listing reports
          </p>
        </div>
        <ListingFeaturesPanel />
      </div>
    </DashboardLayout>
  );
};

export default MyEngagements;
