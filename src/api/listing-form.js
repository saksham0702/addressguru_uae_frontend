import axios from "axios";

const API_URL = "http://192.168.31.107:5001";
// const API_URL = "https://addressguru.ae/api";

export const add_listings = async (payload, step, slug) => {
  const token = localStorage.getItem("authToken");

  try {
    let url = "";
    let method = "post";

    // ✅ STEP 1 → CREATE
    if (step === 1) {
      url = `${API_URL}/business-listing/create-listing/step/1`;
      method = "post";
    }
    // ✅ STEP 2+ → UPDATE
    else {
      url = `${API_URL}/business-listing/update-listing/${slug}/step/${step}`;
      method = "put";
    }

    const response = await axios({
      method,
      url,
      data: payload,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    return response;
  } catch (error) {
    console.log("API ERROR:", error?.response);
    return error.response?.data;
  }
};
