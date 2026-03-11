import axios from "axios";
import { API_URL } from "@/services/constants";

// jobs apis
export const get_job_categories = async () => {
  try {
    const response = await axios.get(`${API_URL}/jobs/categories`);
    return response;
  } catch (error) {
    console.log("error getting job categories", error);
    return error;
  }
};

export const get_job_type = async () => {
  try {
    const response = await axios.get(`${API_URL}/jobs/types`);
    return response;
  } catch (error) {
    console.log("error getting job categories", error);
    return error;
  }
};

export const get_job_edulvl = async () => {
  try {
    const response = await axios.get(`${API_URL}/jobs/education-level`);
    return response;
  } catch (error) {
    console.log("error getting job categories", error);
    return error;
  }
};

export const get_job_work_mode = async () => {
   try {
    const response = await axios.get(`${API_URL}/jobs/work-mode`);
    return response;
   } catch (error) {
    console.log("error getting job work mode", error);
    return error;
   }
}

export const post_job_listing = async (postData) => {
  try {
    const formData = new FormData();

    Object.keys(postData).forEach((key) => {
      if (key === "companyLogo" && postData[key]) {
        formData.append(key, postData[key]);
      } else {
        formData.append(key, postData[key] ?? "");
      }
    });

    const response = await axios.post("/api/jobs/store", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Job listing error", error);
    throw error;
  }
};
