import axios from "axios";
import { API_URL } from "@/services/constants";

export const get_job_filter = async () => {
  try {
    const response = await axios.get(`${API_URL}/jobs/filters`);
    console.log("api response for jobs with filter", response.data);
    return response.data;
  } catch (error) {
    console.log("error getting filter data", error);
    return error;
  }
};

export const get_marketplace_filter = async () => {
  try {
    const response = await axios.get(`${API_URL}/marketplace/filters`);
    // console.log("api response for marketplace with filter", response.data);
    return response.data.filter;
  } catch (error) {
    console.log("error getting filter data", error);
    return error;
  }
};

export const get_property_filter = async () => {
  try {
    const response = await axios.get(`${API_URL}/property/filters`);
    // console.log("api response for marketplace with filter", response.data);
    return response.data.filter;
  } catch (error) {
    console.log("error getting filter data", error);
    return error;
  }
};
