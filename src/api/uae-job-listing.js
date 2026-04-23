import axios from "axios";
import { API_URL } from "@/services/constants"
// const API_URL = "http://192.168.31.104:5001";
// const API_URL = "http://192.168.31.107:5001";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json", // IMPORTANT
    },
  };
};

const getAuthConfig = () => {
  const token = localStorage.getItem("authToken");

  return {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};

export const get_job_categories = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/categories/get-categories-by-type/job`,
    );
    console.log(response);

    return response.data.data;
  } catch (error) {
    console.log("error getting job categories", error);
    return error;
  }
};

// export const add_job_listing = async (formData) => {
//   const token = localStorage.getItem("authToken");

//   try {
//     const response = await axios.post(
//       `${API_URL}/jobs-listing/save-job/1`,
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",

//           Accept: "application/json",
//         },
//       },
//     );

//     console.log("response from api of jobs", response?.data);
//     return response?.data;
//   } catch (error) {
//     console.log("error of adding job listing", error?.response?.data);
//     return error?.response?.data;
//   }
// };

// export const save_job_company = async (formData) => {
//   const token = localStorage.getItem("authToken");

//   try {
//     const response = await axios.put(
//       `${API_URL}/jobs-listing/save-job/2`,
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Accept: "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       },
//     );

//     console.log("response from step 2 api", response?.data);
//     return response?.data;
//   } catch (error) {
//     console.log("error from step 2 api", error?.response?.data);
//     return error?.response?.data;
//   }
// };

export const add_job_listing = async (formData) => {
  try {
    const response = await axios.post(
      `${API_URL}/jobs-listing/save-job/1`,
      formData,
      getAuthConfig(),
    );

    console.log("response from api of jobs", response?.data);
    return response?.data;
  } catch (error) {
    console.log("error of adding job listing", error?.response?.data);
    return error?.response?.data;
  }
};

export const save_job_company = async (formData) => {
  try {
    const response = await axios.put(
      `${API_URL}/jobs-listing/save-job/2`,
      formData,
      getAuthConfig(),
    );

    console.log("response from step 2 api", response?.data);
    return response?.data;
  } catch (error) {
    console.log("error from step 2 api", error?.response?.data);
    return error?.response?.data;
  }
};

export const get_all_jobs_listings = async ({ page, limit, status }) => {
  try {
    const response = await axios.get(`${API_URL}/jobs-listing/get-all-jobs`, {
      params: {
        page,
        limit,
        ...(status && { status }),
      },
    });

    console.log("jobs listings:", response);
    return response.data;
  } catch (error) {
    console.log("error getting jobs listings", error);
    return error;
  }
};

// // APPROVE JOB
// export const approve_jobs_listing = async (id) => {
//   try {
//     const response = await axios.put(
//       `${API_URL}/jobs-listing/${id}/status`,
//       {}, // no body
//       getAuthConfig(),
//     );

//     console.log("job approved:", response);
//     return response.data;
//   } catch (error) {
//     console.log("error approving job", error);
//     return error;
//   }
// };

// REJECT JOB
export const approve_reject_jobs_listing = async (id, body) => {
  try {
    const response = await axios.put(
      `${API_URL}/jobs-listing/${id}/status`,
      body,
      getAuthHeader(),
    );

    console.log("job rejected:", response);
    return response.data;
  } catch (error) {
    console.log("error rejecting job", error);
    return error;
  }
};
export const get_monthly_salary = async () => {
  try {
    const res = await axios.get(`${API_URL}/jobs-listing/monthly-salary`);
    return res.data.data;
  } catch (error) {
    console.log("error getting salary ranges", error);
    return [];
  }
};

export const get_nationalities = async () => {
  try {
    const res = await axios.get(`${API_URL}/jobs-listing/nationality`);
    return res.data.data;
  } catch (error) {
    console.log("error getting nationalities", error);
    return [];
  }
};

export const get_languages = async () => {
  try {
    const res = await axios.get(`${API_URL}/jobs-listing/languages`);
    return res.data.data;
  } catch (error) {
    console.log("error getting languages", error);
    return [];
  }
};

export const approve_jobs_listing = async (id) => {
  try {
    const response = await axios.put(
      `${API_URL}/jobs-listing/${id}/status`,
      {
        status: "approved", // ✅ JSON payload
      },
      getAuthHeader(),
    );

    console.log("job approved:", response);
    return response.data;
  } catch (error) {
    console.log("error approving job", error);
    return error;
  }
};

// REJECT JOB
export const reject_jobs_listing = async (id, reason) => {
  try {
    const response = await axios.put(
      `${API_URL}/jobs-listing/${id}/status`,
      {
        reason, // ✅ send reason properly
      },
      getAuthHeader(),
    );

    console.log("job rejected:", response);
    return response.data;
  } catch (error) {
    console.log("error rejecting job", error);
    return error;
  }
};
