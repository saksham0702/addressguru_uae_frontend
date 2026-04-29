import axios from "axios";
import { API_URL } from "@/services/constants";

// job listings
export const get_all_jobs_listings = async (params) => {
  try {
    const response = await axios.get(`${API_URL}/jobs-listing/get-all-jobs`, { params });
    console.log("api response for jobs with filter", response);
    return response.data;
  } catch (error) {
    return null;
  }
};

// job details
export const get_job_details = async (ID) => {
  try {
    const response = await axios.get(`${API_URL}/jobs-listing/get-job/${ID}`);
    // console.log("response of solo job",response?.data?.data)
    return response?.data;
  } catch (error) {
    return null;
  }
};
