import axios from "axios";
import { API_URL } from "@/services/constants";

export const get_form_headings = async () => {
  try {
    const response = axios.get(`${API_URL}/category/form/30`);
    return response;
  } catch (error) {
    console.log("forms heading error", error);
    return error?.message;
  }
};

// add jobs form setp wise post api
export const add_job_listing = async (formData) => {
  const token = localStorage.getItem("authToken");

  try {
    const response = await axios.post(`${API_URL}/jobs/store`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    console.log("response from api of jobs", response?.data);
    return response?.data;
  } catch (error) {
    console.log("error of adding job listing", error?.response?.data);
    return error?.response?.data;
  }
};

//add listings step by step
// export const add_listings = async (payload) => {
//   const token = localStorage.getItem("authToken");
//   console.log("payload of listing", payload);
//   // console.log("token", token);
//   try {
//     const response = await axios.post(`${API_URL}/posts/save-data`, payload, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//         Authorization: `Bearer ${token}`,
//         Accept: "application/json",
//       },
//     });
//     // console.log("res of add listing", response);
//     return response?.data;
//   } catch (error) {
//     console.log("error of adding listing", error?.response?.data?.errors);
//     return error?.response?.data;
//   }
// };

// add marketplace listing
export const add_marketplace_listing = async (payload) => {
  const token = localStorage.getItem("authToken");
  console.log("payload of listing", payload);
  try {
    const response = await axios.post(`${API_URL}/marketplace/store`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    console.log("res of add marketplace listing", response);
    return response;
  } catch (error) {
    console.log("error of adding marketplace listing", error);
    return error?.response?.data?.errors;
  }
};
// get facilities or properties
export const get_service_facility = async (ID) => {
  const token = localStorage.getItem("authToken");
  try {
    const response = await axios.get(
      `${API_URL}/categories/service-facility/${ID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    // console.log("response of facility", response);
    return response?.data;
  } catch (error) {
    return error;
  }
};

export const get_payment_mode = async () => {
  try {
    const response = await axios.get(`${API_URL}/payment-mode`);
    return response?.data?.result;
  } catch (error) {
    return error;
  }
};

// add properties listing
export const add_properties_listing = async (payload) => {
  const token = localStorage.getItem("authToken");
  console.log("payload of listing", payload);
  try {
    const response = await axios.post(
      `${API_URL}/property/save-data`,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );
    console.log("res of add marketplace listing", response);
    return response?.data;
  } catch (error) {
    console.log("error of adding marketplace listing", error?.response);
    return error?.response?.data;
  }
};

// // add listing step by step
// export const add_listing_stepwise = async (payload, step) => {
//   const token = localStorage.getItem("authToken");
//   try {
//     const res = await axios.post(`${API_URL}`, payload, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//         Authorization: `Bearer ${token}`,
//         Accept: "application/json",
//       },
//     });
//     console.log("response of singe listing", res);
//   } catch (error) {
//     console.log("error step from", error);
//   }
// };

export const get_company_data = async () => {
  const token = localStorage.getItem("authToken");
  try {
    const res = await axios.get(`${API_URL}/previous-company`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res?.data;
  } catch (error) {
    console.log("error of company data in api", error);
  }
};
