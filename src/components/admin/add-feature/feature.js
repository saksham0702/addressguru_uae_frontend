"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import FeatureModal from "./featurepopup";
import { useFeatures } from "@/hooks/usefeatures";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

const TABS = [
  { key: "facilities", label: "Facilities", singular: "Facility" },
  { key: "services", label: "Services", singular: "Service" },
  { key: "courses", label: "Courses", singular: "Course" },
  { key: "paymentModes", label: "Payment Modes", singular: "Payment Mode" },
];

export default function AddFeaturesTabs() {
  const [activeTab, setActiveTab] = useState("facilities");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, createFeature, updateFeature, deleteFeature } = useFeatures();

  const currentTab = TABS.find((t) => t.key === activeTab);

  const handleSubmit = async (item) => {
    if (editingItem) {
      await updateFeature(editingItem._id, item, activeTab);
      setEditingItem(null);
    } else {
      await createFeature(item, activeTab);
    }

    setIsModalOpen(false);
  };

  // Filter items based on search
  const filteredData = data[activeTab].filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="w-full min-h-screen bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <h2 className="text-lg font-semibold text-gray-800">Manage Features</h2>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder={`Search ${currentTab.label}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Add Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow hover:opacity-90 transition"
          >
            <Plus size={16} />
            Add {currentTab.singular}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="flex bg-gray-100 p-1 rounded-xl">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setSearchTerm(""); // reset search when tab changes
              }}
              className={`relative px-6 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab.key
                  ? "text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {activeTab === tab.key && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white rounded-lg shadow-sm"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {filteredData.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 text-sm py-16">
            No {currentTab.label} found.
          </div>
        ) : (
          filteredData.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-gray-200 rounded-lg px-4 py-3
              flex items-center justify-between shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-2">
                {item.iconSvg && (
                  <div
                    className="w-4 h-4 text-indigo-600 [&>svg]:w-4 [&>svg]:h-4"
                    dangerouslySetInnerHTML={{ __html: item.iconSvg }}
                  />
                )}

                <span className="text-sm font-medium text-gray-700 capitalize">
                  {item.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Edit */}
                <button
                  onClick={() => {
                    setEditingItem(item);
                    setIsModalOpen(true);
                  }}
                  className="text-blue-500 hover:text-blue-700 transition"
                >
                  <Pencil size={16} />
                </button>

                {/* Delete */}
                <button
                  onClick={() => deleteFeature(item._id, activeTab)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <FeatureModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        type={activeTab}
        singular={currentTab.singular}
        onSubmit={handleSubmit}
        initialData={editingItem}
      />
    </div>
  );
}
