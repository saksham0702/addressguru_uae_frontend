import CategoryRow from "@/components/admin/categorypopup/categoryrow";
import axios from "axios";

// const API_URL = "http://192.168.29.191:5001/api";
const API_URL = "https://addressguru.ae/api";

// const API_URL = "http://192.168.31.107:5001";

export const createOrUpdateCategory = async (payload) => {
  try {
    const isEdit = Boolean(payload?.id);

    const response = await axios({
      method: isEdit ? "PUT" : "POST",
      url: isEdit
        ? `${API_URL}/categories/update-category/${payload.id}`
        : `${API_URL}/categories/create-category`,

      data: {
        ...payload,
      },

      headers: {
        "Content-Type": "application/json",
      },

      withCredentials: true,
    });

    console.log(
      `category ${isEdit ? "update" : "create"} response:`,
      response.data,
    );

    return response.data;
  } catch (err) {
    const message =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Something went wrong";

    console.log("category api error:", message);

    // ✅ throw clean error
    throw new Error(message);
  }
};

export const getAllCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories/get-categories`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    console.table("get all categories response:", response?.data);
    return response.data;
  } catch (err) {
    console.log("get all categories error", err?.response?.data || err.message);
  }
};

export const getCategorybyType = async (type = "business") => {
  try {
    const response = await axios.get(
      `${API_URL}/categories/get-categories-by-type/${type}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      },
    );

    console.table("get all categories response:", response?.data);
    return response.data;
  } catch (err) {
    console.log("get all categories error", err?.response?.data || err.message);
  }
};

export const getsingleCategory = async ({ id }) => {
  try {
    const response = await axios.get(
      `${API_URL}/categories/get-category/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    console.log("get all categories response:", response.data);
    return response.data;
  } catch (err) {
    console.log("get all categories error", err?.response?.data || err.message);
    throw err;
  }
};

export const testCookie = async () => {
  try {
    const res = await axios.get(`${API_URL}/test-cookie`, {
      withCredentials: true,
    });

    console.log("cookie response:", res.data);
  } catch (err) {
    console.log("cookie test error", err);
  }
};
/* ================= CREATE / UPDATE ================= */

export const createOrUpdateSubCategory = async (payload) => {
  try {
    const isEdit = Boolean(payload?.id);

    const response = await axios({
      method: isEdit ? "PATCH" : "POST",
      url: isEdit
        ? `${API_URL}/sub-categories/update-subcategory/${payload.id}`
        : `${API_URL}/sub-categories/create-subcategories/${payload.parentId}`,
      data: {
        name: payload.name,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(
      `subcategory ${isEdit ? "update" : "create"} response:`,
      response.data,
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (err) {
    const message =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Failed to save subcategory";

    console.log("subcategory api error:", message);

    return {
      success: false,
      message,
    };
  }
};
/* ================= GET BY CATEGORY ================= */

export const getSubCategoriesByCategory = async (categoryId) => {
  try {
    const response = await axios.get(
      `${API_URL}/sub-categories/get-subcategorybyslug/${categoryId}`,
    );
    return response.data;
  } catch (err) {
    console.log("get subcategories error", err);
    throw err;
  }
};

/* ================= DELETE ================= */

export const deleteSubCategory = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/sub-categories/delete-subcategory/${id}`,
    );

    console.log("delete subcategory response:", response.data);
    return response.data;
  } catch (err) {
    console.log("delete subcategory error", err?.response?.data || err.message);
    throw err;
  }
};

export const getFacilitiesByCategory = async (categoryId) => {
  try {
    console.log("category id:", categoryId);

    const response = await axios.get(
      `${API_URL}/features/get-feature/facility?category=${categoryId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (err) {
    console.error(
      "get facilities by category error",
      err?.response?.data || err.message,
    );
    throw err;
  }
};

export const addFacilityFeature = async (payload) => {
  try {
    const response = await axios.post(
      `${API_URL}/features/add-feature-item/facility`,
      {
        name: payload.name,
        category: payload.category,
        items: payload.items,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (err) {
    console.error(
      "add facility feature error",
      err?.response?.data || err.message,
    );
    throw err;
  }
};

export const getFeatureByCategory = async (type, categoryId) => {
  try {
    console.log(`${type} category id:`, categoryId);

    const response = await axios.get(
      `${API_URL}/features/get-feature/${type}?category=${categoryId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    console.log("getfeature by categroy response: ", response?.data);
    return response.data;
  } catch (err) {
    console.error(
      `get ${type} by category error`,
      err?.response?.data || err.message,
    );
    throw err;
  }
};

/* ================= ADD FEATURE (FACILITY / SERVICE) ================= */

export const addFeatureItem = async (type, payload) => {
  try {
    const response = await axios.post(
      `${API_URL}/features/add-feature-item/${type}`,
      {
        name: payload.name,
        category: payload.category,
        items: payload.items,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (err) {
    console.error(
      `add ${type} feature error`,
      err?.response?.data || err.message,
    );
    throw err;
  }
};

/* ================= UPDATE FEATURE ITEM ================= */

export const updateFeatureItem = async (type, itemId, payload) => {
  try {
    console.log(payload);

    const response = await axios.put(
      `${API_URL}/features/update-feature-item/${type}/${itemId}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    console.log("facility update response", response.data);
    return response.data;
  } catch (err) {
    console.error(
      "update feature item error",
      err?.response?.data || err.message,
    );
    throw err;
  }
};

/* ================= DELETE FEATURE ITEM ================= */

export const deleteFeatureItem = async (type, itemId, id) => {
  try {
    console.log("category id:", id);

    const response = await axios.delete(
      `${API_URL}/features/delete-feature-item/${type}/${itemId}`,
      {
        data: { category: id }, // ✅ Correct way
      },
    );

    return response.data;
  } catch (err) {
    console.error(
      "delete feature item error",
      err?.response?.data || err.message,
    );
    throw err;
  }
};

export const bulkAddFeatureItems = async (type, payload) => {
  try {
    const response = await axios.post(
      `${API_URL}/features/bulk-add-feature-items/${type}`,
      payload,
    );

    return response.data;
  } catch (error) {
    console.error(
      "Bulk add feature items error:",
      error?.response?.data || error.message,
    );
    throw error?.response?.data || error.message;
  }
};

const generateFieldName = (label) => {
  return label
    ?.toLowerCase()
    ?.trim()
    ?.replace(/\s+/g, "_")
    ?.replace(/[^a-z0-9_]/g, "");
};

/* ========= CREATE FIELD ========= */

export const createAdditionalField = async (data) => {
  console.log("i amm hit");
  console.log("data of payload", data);
  try {
    console.log("try");

    const res = await axios.post(
      `${API_URL}/additional-fields/create-field`,
      data,
    );

    return { status: true, data: res.data };
  } catch (error) {
    console.log("catch");

    console.log("Additional Field Error:", error?.response || error.message);

    return {
      status: false,
      message: error?.response?.data?.message || "Something went wrong",
    };
  }
};

export const getAdditionalFieldsByCategory = async (category_id) => {
  try {
    const res = await axios.get(`${API_URL}/additional-fields/get-fields`, {
      params: { category_id },
    });

    return {
      status: true,
      data: res.data?.data || [],
    };
  } catch (error) {
    console.error("Get Fields Error:", error?.response?.data || error.message);

    return {
      status: false,
      data: [],
    };
  }
};

export const createFeatureApi = async (payload) => {
  const res = await fetch(`${API_URL}/features/create-feature`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to create feature");
  }

  return data;
};

/**
 * Get All Features
 */
export const getAllFeaturesApi = async () => {
  const res = await fetch(`${API_URL}/features/get-all-features`);
  console.log("features response", res);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch features");
  }

  return data;
};

/**
 * Update Feature
 */

export const updateFeatureApi = async (id, payload) => {
  const res = await fetch(`${API_URL}/features/update-feature/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to update feature");
  }

  return data;
};

/**
 * Soft Delete Feature
 */

export const deleteFeatureApi = async (id) => {
  const res = await fetch(`${API_URL}/features/delete-feature/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to delete feature");
  }

  return data;
};

/* Get category assigned features */
export const getCategoryFeaturesApi = async (categoryId) => {
  const res = await fetch(`${API_URL}/categories/${categoryId}/features`);
  return await res.json();
};

/* Assign features to category */
export const assignFeaturesApi = async (categoryId, payload) => {
  return axios.post(
    `${API_URL}/features/category/${categoryId}/assign`,
    payload, // ✅ send directly
  );
};

export const getallfeaturesdatabyCategory = async (categoryId) => {
  return axios.get(`${API_URL}/features/category/${categoryId}`);
};

export const removeFeatureFromCategoryApi = async (
  categoryId,
  featureId,
  featureType,
) => {
  return axios.delete(
    `${API_URL}/features/category/${categoryId}/remove/${featureId}`,
    {
      data: { featureType }, // ⚠️ body must be inside "data"
    },
  );
};

// get-subcategory/

export const getsingleSubCategory = async ({ id }) => {
  console.log(id);
  try {
    const response = await axios.get(
      `${API_URL}/sub-categories/get-subcategory/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    console.log("get single sub category response", response.data);
    return response.data;
  } catch (err) {
    console.log("get all categories error", err?.response?.data || err.message);
    throw err;
  }
};

export const getSubCategoryFeaturesApi = async (categoryId, subCategoryId) => {
  try {
    const res = await axios.get(
      `${API_URL}/features/category/${categoryId}/subcategory/${subCategoryId}`,
    );

    return res.data;
  } catch (err) {
    console.error(
      "get subcategory features error",
      err?.response?.data || err.message,
    );
    throw err;
  }
};

export const assignFeaturesToSubCategoryApi = async (
  categoryId,
  subCategoryId,
  payload,
) => {
  try {
    const res = await axios.post(
      `${API_URL}/features/category/${categoryId}/subcategory/${subCategoryId}/assign`,
      payload,
    );

    return res.data;
  } catch (err) {
    console.error(
      "assign features to subcategory error",
      err?.response?.data || err.message,
    );
    throw err;
  }
};

export const removeFeatureFromSubCategoryApi = async (
  categoryId,
  subCategoryId,
  featureId,
  featureType,
) => {
  try {
    const res = await axios.delete(
      `${API_URL}/features/category/${categoryId}/subcategory/${subCategoryId}/remove/${featureId}`,
      {
        data: { featureType },
      },
    );

    return res.data;
  } catch (err) {
    console.error(
      "remove feature from subcategory error",
      err?.response?.data || err.message,
    );
    throw err;
  }
};

export const getBusinessListing = async (id) => {
  try {
    const response = await axios.get(
      `${API_URL}/business-listing/get-features-and-additional-fields/${id}`,
    );
    console.log("get business response", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching business listing:", error);
    throw error;
  }
};
