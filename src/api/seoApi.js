import axios from "axios";
import { API_URL } from "@/services/constants";
// const API_URL = "http://localhost:5001";

// USER API

// Get SEO by category + city slug
export const get_seo_data = async (category_slug, city_slug) => {
  try {
    const response = await axios.get(
      `${API_URL}/seo-content?category_slug=${category_slug}&city_slug=${city_slug}`,
    );

    return response?.data?.data || null;
  } catch (error) {
    console.log("error fetching seo data", error.message);
    return null;
  }
};

// EDITOR APIs

// Create / Update SEO Content
export const upsert_seo_content = async (payload) => {
  try {
    const response = await axios.post(
      `${API_URL}/seo-content/upsert`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );

    return response?.data;
  } catch (error) {
    console.log("error saving seo content", error);
    return error;
  }
};

// Get All SEO Content (Admin)
export const get_all_seo_content = async () => {
  try {
    const response = await axios.get(`${API_URL}/seo-content/all`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    return response?.data;
  } catch (error) {
    console.log("error fetching all seo content", error);
    return error;
  }
};

// Delete SEO Content
export const delete_seo_content = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/seo-content/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    return response?.data;
  } catch (error) {
    console.log("error deleting seo content", error);
    return error;
  }
};
