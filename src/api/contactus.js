import axios from "axios";
import { API_URL } from "@/services/constants";

export const contactUsApi = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/contact-us`, data);
    return response.data;
  } catch (error) {
    return error;
  }
};
