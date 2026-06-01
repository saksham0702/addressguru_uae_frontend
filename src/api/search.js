import axios from "axios";
import { API_URL } from "@/services/constants";

// 🔍 Live suggestions while typing
export const fetchSearchSuggestions = async (query) => {
  try {
    const response = await axios.get(
      `${API_URL}/search/suggestions?q=${encodeURIComponent(query)}`,
    );
    console.log("suggestions response", response?.data);
    return response?.data;
  } catch (error) {
    console.log("suggestions error", error);
    return { suggestions: [] };
  }
};

// 🔍 Resolve search intent on submit
export const resolveSearch = async (query, page = 1, limit = 20) => {
  try {
    const response = await axios.get(
      `${API_URL}/search/resolve?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
    );
    return response?.data;
  } catch (error) {
    console.log("resolve search error", error);
    return { intent: "no_results" };
  }
};

// Legacy — keep for backward compat if used elsewhere
export const searchListings = async (query) => {
  try {
    const response = await axios.get(
      `${API_URL}/search?q=${encodeURIComponent(query)}`,
    );
    return response?.data;
  } catch (error) {
    return error?.response?.data || { success: false, message: "Server error" };
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
