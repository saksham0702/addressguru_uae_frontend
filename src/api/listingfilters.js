import axios from "axios";
import { API_URL } from "@/services/constants";

export const get_listing_filters = async (SLUG) => {
  console.log("SLUG", SLUG);
  try {
    const response = await axios.get(`${API_URL}/listing/filters/${SLUG}`);
    if (response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    console.log("get_listing_filters", error);
    return error;
  }
};
