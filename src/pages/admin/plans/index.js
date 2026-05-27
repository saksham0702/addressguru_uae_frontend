import { get_plans } from "@/api/plans";
import PlanList from "@/components/Plans/PlanList";
import PlanForm from "@/components/Plans/PlanForm";
import { useEffect, useState } from "react";

const planTypes = ["business", "marketplace", "property", "job"];
const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activePlanType, setActivePlanType] = useState("business");
  const fetchPlans = async (planType = "business") => {
    // ← accept planType
    try {
      setLoading(true);
      const res = await get_plans(planType); // ← pass it to your API call
      if (res?.data?.plans) {
        setPlans(res.data.plans);
      }
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans(activePlanType);
  }, [activePlanType]);

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setShowForm(true);
  };

  const handleCreate = () => {
    setSelectedPlan(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedPlan(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">
                Subscription Plans
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your pricing plans and features
              </p>
            </div>
            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200">
              <nav className="flex gap-1">
                {planTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setActivePlanType(type)}
                    className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors capitalize ${
                      activePlanType === type
                        ? "bg-white border border-b-white border-gray-200 text-blue-600 -mb-px"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </nav>
            </div>
            <button
              onClick={handleCreate}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Plan
            </button>
          </div>
        </div>

        {/* Plans List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <PlanList plans={plans} onEdit={handleEdit} refresh={fetchPlans} />
        )}

        {/* Form Modal */}
        {showForm && (
          <PlanForm
            plan={selectedPlan}
            onClose={handleCloseForm}
            refresh={() => fetchPlans(activePlanType)}
            defaultPlanType={activePlanType} // ← add this
          />
        )}
      </div>
    </div>
  );
};

export default Plans;
