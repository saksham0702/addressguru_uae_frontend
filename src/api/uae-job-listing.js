import axios from "axios";

// const API_URL = "http://192.168.31.104:5001";
// const API_URL = "http://192.168.31.107:5001";
const API_URL = "https://addressguru.ae/api";

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
