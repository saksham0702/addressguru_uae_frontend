import axios from "axios";
import { API_URL } from "@/services/constants";

// all categories
export const get_categories = async () => {
  try {
    const res = await axios.get(`${API_URL}/categories/listing`);
    // console.log(res?.data);
    return res?.data;
  } catch (error) {
    console.log(error);
    return null; // Optional: return a fallback
  }
};
// for the dashboard
export const get_subCategories = async (ID) => {
  try {
    const res = await axios.get(`${API_URL}/subcategories/${ID}`);
    return res?.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const get_marketplace_subcategories = async (ID) => {
  try {
    const res = await axios.get(`${API_URL}/marketplace/sub-category?cat_id=${ID}&sub=1`);
    return res?.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
// stuff for sale or marketplace category for dashboard popups
export const get_sub_category = async (type) => {
  try {
    const res = await axios.get(`${API_URL}/categories/${type}`);
    console.log(res?.data)
    return res?.data;
  } catch (error) {
    console.log(error);
  }
};

// stuff for sale or marketplace category for dashboard popups
export const get_sub_category_marketplace = async () => {
  try {
    const res = await axios.get(`${API_URL}/marketplace/sub-categories`);
    console.log(res?.data)
    return res?.data;
  } catch (error) {
    console.log(error);
  }
};

