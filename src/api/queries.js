import axios from "axios";
import { API_URL } from "@/services/constants";

// 🔹 Query API
export const query = async (type, id, payload) => {
  console.log("payload", payload);
  try {
    const response = await axios.post(
      `${API_URL}/query/${type}/${id}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response);
    return response?.data?.message;
  } catch (error) {
    console.error("Job query error:", error);
    return error;
  }
};

// report api
export const report = async (type, id, payload) => {
  console.log(payload);
  try {
    const response = await axios.post(
      `${API_URL}/report/${type}/${id}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response);
    return response?.data;
  } catch (error) {
    console.log(error, "report error", error);
  }
};

// 🔹 Rate Us API
export const rate_us = async (type, id, payload) => {
  console.log("api payload", payload, type, id);
  try {
    const response = await axios.post(
      `${API_URL}/ratings/${type}/${id}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("rating response", response?.data);
    return response;
  } catch (error) {
    console.error("Error in rating API:", error);
    return error;
  }
};

// 🔹 Claim Business API
export const claim_business = async (payload, type, id) => {
  console.log(payload);
  try {
    const response = await axios.post(
      `${API_URL}/claim/${type}/${id}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Claim business error:", error);
    return error; // Re-throw to handle in component
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
    console.error("error", error?.response?.data || error.message);
    throw error;
  }
};


// send listings in mail api

export const send_listings_in_mail = async (payload) => {
  console.log("payload", payload);
  try {
      const response = await axios.post(`${API_URL}/lead/send`, payload, {
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
