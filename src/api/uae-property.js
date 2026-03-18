import axios from "axios";

const API_URL = "http://192.168.31.107:5001";

export const add_property_listing = async ({ payload, step, listingId }) => {
    
  try {
    let response;

    if (step === 1) {
      // ✅ CREATE LISTING
      response = await axios.post(
        `${API_URL}/property-listings/create-listing`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        },
      );
    } else {
      // ❗ SAFETY CHECK
      if (!listingId) {
        throw new Error("listing id is required for step > 1");
      }

      // ✅ UPDATE LISTING
      response = await axios.put(
        `${API_URL}/property-listings/update-listing/${listingId}/step/${step}`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        },
      );
    }

    return response.data;
  } catch (error) {
    console.error("Property listing API error:", error);

    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong",
      errors: error?.response?.data?.errors || null,
    };
  }
};
