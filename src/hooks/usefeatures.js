"use client";

import {
  createFeatureApi,
  getAllFeaturesApi,
  updateFeatureApi,
  deleteFeatureApi,
} from "@/api/uaeAdminCategories";
import { useEffect, useState } from "react";

export const useFeatures = () => {
  const [data, setData] = useState({
    facilities: [],
    services: [],
    courses: [],
    paymentModes: [],
  });

  const [loading, setLoading] = useState(false);

  // ✅ Central mapping (BEST PRACTICE)
  const typeMap = {
    facilities: "facility",
    services: "service",
    courses: "course",
    paymentModes: "payment_mode",
  };

  const fetchFeatures = async () => {
    try {
      setLoading(true);
      const result = await getAllFeaturesApi();

      const grouped = {
        facilities: [],
        services: [],
        courses: [],
        paymentModes: [],
      };

      result.data.forEach((item) => {
        if (item.type === "facility") grouped.facilities.push(item);
        if (item.type === "service") grouped.services.push(item);
        if (item.type === "course") grouped.courses.push(item);
        if (item.type === "payment_mode") grouped.paymentModes.push(item);
      });

      setData(grouped);
    } catch (error) {
      console.error("Fetch Features Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const createFeature = async (item, activeTab) => {
    try {
      const payload = {
        name: item.name,
        type: typeMap[activeTab], // ✅ CLEAN
        iconSvg: item.svg || "",
      };

      const result = await createFeatureApi(payload);

      setData((prev) => ({
        ...prev,
        [activeTab]: [...prev[activeTab], result.data],
      }));

      return result;
    } catch (error) {
      console.error("Create Feature Error:", error.message);
      throw error;
    }
  };

  const updateFeature = async (id, item, activeTab) => {
    const payload = {
      name: item.name,
      iconSvg: item.svg || "",
    };

    const result = await updateFeatureApi(id, payload);

    setData((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].map((f) => (f._id === id ? result.data : f)),
    }));

    return result;
  };

  const deleteFeature = async (id, activeTab) => {
    await deleteFeatureApi(id);

    setData((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].filter((f) => f._id !== id),
    }));
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  return {
    data,
    loading,
    createFeature,
    updateFeature,
    deleteFeature,
  };
};
