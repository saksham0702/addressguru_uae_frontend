import axios from "axios";
import { API_URL } from "@/services/constants";

// Blog Apis

// categories => ('blogs/categories')
// recent => ('blogs/recent')
// most-viewed => ('blogs/most-viewed')
// details => ('blogs/details/{slug}')
// all blogs =>  ('blogs/{category?}')

//get all blogs
export const getBlogs = async () => {
  try {
    const response = await axios.get(`${API_URL}/blogs`);
    // console.log("blogs", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

//get single blog details
export const getBlogDetails = async (slug) => {
  console.log("slug", slug);
  try {
    const response = await axios.get(`${API_URL}/blogs/details/${slug}`);
    // console.log("blog details", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching blog details:", error);
    throw error;
  }
};

// get categories
export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/blogs/categories`);
    // console.log("categories", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

//get recent blogs
export const getRecentBlogs = async () => {
  try {
    const response = await axios.get(`${API_URL}/blogs/recent`);
    // console.log("recent blogs", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching recent blogs:", error);
    throw error;
  }
};

//get most viewed blogs
export const getMostViewedBlogs = async () => {
  try {
    const response = await axios.get(`${API_URL}/blogs/most-viewed`);
    // console.log("most viewed blogs", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching most viewed blogs:", error);
    throw error;
  }
};

//get all blogs by category
export const getBlogsByCategory = async (category) => {
  try {
    const response = await axios.get(`${API_URL}/blogs/${category}`);
    // console.log("blogs by category", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs by category:", error);
    throw error;
  }
};
