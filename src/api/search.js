import axios from "axios";
import { API_URL } from "@/services/constants";
// const API_URL = "http://localhost:5001";



// 🔍 Search Listings
export const searchListings = async (query) => {
  console.log("query in search listings", query);
  try {
    const response = await axios.get(
      `${API_URL}/search?q=${encodeURIComponent(query)}`,
    );

    return response?.data;
  } catch (error) {
    console.log("search listings error", error);

    return (
      error?.response?.data || {
        success: false,
        message: "Server error",
      }
    );
  }
};




export const searchData = async (slug, city) => {
  try {
    const url = `${API_URL}/global-search`;

    const payload = {
      search: slug,
      city: city,
    };

    const res = await axios.post(url, payload);
    return res.data;
  } catch (error) {
    console.log("error in search data api", error);
    throw error;
  }
};
