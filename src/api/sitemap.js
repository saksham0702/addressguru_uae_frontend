import axios from "axios";
import { API_URL } from "@/services/constants";

export const getSitemap = async () => {
  try {
    const response = await axios.get(`${API_URL}/sitemap`);
    return response.data.result;
  } catch (error) {
    console.error("Error fetching sitemap:", error);
    return error;
  }
};

export const getSectionSitemap = async (section) => {
  try {
    const response = await axios.get(`${API_URL}/sitemap/${section}?flat=true`);
    return response.data.result;
  } catch (error) {
    console.log("error fetching sections sitemap:", error);
    return error;
  }
};

export const getSectionTypeSitemap = async (section, type) => {
  try {
    const response = await axios.get(`${API_URL}/sitemap/${section}/${type}`);
    return response.data.result;
  } catch (error) {
    console.log("error fetching sections sitemap:", error);
    return error;
  }
};

export const getCityListings = async (section, slug, city) => {
  console.log("section", section);
  console.log("slug", slug);
  console.log("city", city);
  try {
    const response = await axios.get(
      `${API_URL}/sitemap/${section}/${slug}/${city}`,
    );
    return response.data.result;
  } catch (error) {
    console.log("error fetching city listings sitemap:", error);
    return error;
  }
};
