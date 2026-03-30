import axios from "axios";

const API_URL = "https://addressguru.ae/api";

export const add_property_listing = async ({ payload, step, slug }) => {
  try {
    let url = "";
    let method = "post";
    const token = localStorage.getItem(`authToken`);
    if (step === 1) {
      url = `${API_URL}/property-listings/create-listing/step/${step}`;
      method = "post";
    } else {
      if (!slug) {
        throw new Error("Slug is required for update steps");
      }

      url = `${API_URL}/property-listings/update-listing/${slug}/step/${step}`;
      method = "put";
    }

    const response = await axios({
      method,
      url,
      data: payload,
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        Authorization: `Bearer ${token}`, // ✅ bearer token added
      },
    });

    return response.data;
  } catch (error) {
    console.log("Property listing API error:", error);

    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong",
      errors: error?.response?.data?.errors || null,
    };
  }
};

export const get_all_property_listing = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/property-listings/get-all-listings?page=1&limit=10`,
    );

    return response?.data;
  } catch (error) {
    console.log("this is get property error", error);
    return error?.response?.data;
  }
};

export const reject_property_listing = (id, data) => {
  const token = localStorage.getItem("token"); // 👈 get token

  return axios.put(`${API_URL}/property-listings/${id}/status`, data, {
    headers: {
      Authorization: `Bearer ${token}`, // 👈 attach token
    },
  });
};

export const approve_property_listing = (id) => {
  const token = localStorage.getItem("token");

  return axios.put(
    `${API_URL}/property-listings/${id}/status`,
    {
      status: "approved", // ✅ IMPORTANT
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};
