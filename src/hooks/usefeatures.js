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
  });

  const [loading, setLoading] = useState(false);

  const fetchFeatures = async () => {
    try {
      setLoading(true);
      const result = await getAllFeaturesApi();

      const grouped = {
        facilities: [],
        services: [],
        courses: [],
      };

      result.data.forEach((item) => {
        if (item.type === "facility") grouped.facilities.push(item);
        if (item.type === "service") grouped.services.push(item);
        if (item.type === "course") grouped.courses.push(item);
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
        type:
          activeTab === "facilities"
            ? "facility"
            : activeTab === "services"
              ? "service"
              : "course",
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
