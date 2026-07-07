import axios from "axios";
import { API_URL } from "@/services/constants";

export const getLogs = async () => {
  try {
    const response = await axios.get(`${API_URL}/logs`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    return response?.data;
  } catch (error) {
    console.log("error getting logs", error);
    return error;
  }
};
