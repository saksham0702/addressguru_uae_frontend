import axios from "axios";
// import { API_URL } from "@/services/constants";
const API_URL = "https://addressguru.ae/api";

// 🔹 Query API (Enquiry)
export const query = async (type, slug, payload) => {
  console.log("payload", payload);
  try {
    const response = await axios.post(
      `${API_URL}/${type}/${slug}/enquiry`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    console.log(response);
    return response?.data;
  } catch (error) {
    console.error("Enquiry error:", error);
    throw error?.response?.data || error;
  }
};

// report api
export const report = async (type, slug, payload) => {
  const url = `${API_URL}/${type}/${slug}/report`;
  console.log("report url", url);

  try {
    const response = await axios.post(
      `${API_URL}/${type}/${slug}/report`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    console.log(response);
    return response?.data;
  } catch (error) {
    console.error("Report error:", error);
    throw error?.response?.data || error;
  }
};

// get report reasons
export const get_report_reasons = async () => {
  try {
    const response = await axios.get(`${API_URL}/report-reasons`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching report reasons:", error);
    return [];
  }
};

// 🔹 Rate Us API (Review)
export const rate_us = async (type, slug, payload) => {
  console.log("api payload", payload, type, slug);
  try {
    const response = await axios.post(
      `${API_URL}/${type}/${slug}/review`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    console.log("rating response", response?.data);
    return response.data;
  } catch (error) {
    console.error("Error in rating API:", error);
    throw error?.response?.data || error;
  }
};

// 🔹 Claim Business API
export const claim_business = async (payload, type, slug) => {
  console.log(payload);
  try {
    const response = await axios.post(
      `${API_URL}/${type}/${slug}/claim`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Claim business error:", error);
    throw error?.response?.data || error;
  }
};

// views and leads api on hit

export const get_view = async (type, id, viewType, userIP) => {
  console.log("type", type);
  console.log("id", id);
  console.log("viewType", viewType);
  console.log("userIP", userIP);

  try {
    // Build params object dynamically
    const params = {};

    if (viewType) params.view_type = viewType;
    if (userIP) params.user_ip = userIP;

    const config = Object.keys(params).length > 0 ? { params } : {};

    const response = await axios.get(`${API_URL}/view/${type}/${id}`, config);

    console.log("res", response.data);
    return response.data;
  } catch (error) {
    console.log("error", error?.response?.data || error.message);
  }
};

// send listings in mail api

export const send_listings_in_mail = async (payload) => {
  console.log("payload", payload);
  try {
    const response = await axios.post(`https://addressguru.ae/api/business-listing/send-digest`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("send listings in mail error:", error);
    return error;
  }
};
