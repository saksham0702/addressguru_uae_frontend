import axios from "axios";
import { API_URL } from "@/services/constants";

export const create_order = async (data) => {
  const token = localStorage.getItem("authToken");

  const response = await axios.post(`${API_URL}/payment/create-order`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const verify_payment = async (data) => {
  const token = localStorage.getItem("authToken");

  const response = await axios.post(`${API_URL}/payment/verify-payment`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const get_all_payments = async ({
  page = 1,
  limit = 10,
  status,
  search,
} = {}) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/payment/get-payments`, {
      params: {
        page,
        limit,
        ...(status && status !== "all" && { status }),
        ...(search && { search }),
      },
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    return null;
  }
};
