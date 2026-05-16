import axios from "axios";
import { API_URL } from "@/services/constants";

export const create_order = async (data) => {
  console.log("data", data);
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
