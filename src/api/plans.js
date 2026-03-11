import axios from "axios";
import { API_URL } from "@/services/constants";

export const get_plans = async () => {
  try {
    const res = await axios.get(`${API_URL}/plans`);
    return res?.data;
  } catch (error) {
    console.log(error);
    return error; // Optional: return a fallback
  }
};