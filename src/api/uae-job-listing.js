import axios from "axios";

// const API_URL = "http://192.168.31.104:5001";
// const API_URL = "http://192.168.31.107:5001";
const API_URL = "https://addressguru.ae/api";

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
      withCredentials: true,
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

export const save_job = async ({ step, formData, isEdit = false }) => {
  try {
    const url = `${API_URL}/jobs-listing/save-job/${step}`;

    // ✅ Decide method
    const method = isEdit ? "put" : step === 1 ? "post" : "put";

    const response = await axios({
      method,
      url,
      data: formData,
      ...getAuthConfig(),
    });

    console.log(`response from step ${step}`, response?.data);

    return {
      success: true,
      data: response?.data,
    };
  } catch (error) {
    console.log(`error from step ${step}`, error?.response?.data);

    return {
      success: false,
      error: error?.response?.data,
    };
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


export const apply_for_job = async (slug, formData) => {
  try {
    const response = await axios.post(`${API_URL}/applications/${slug}/apply`, formData,{
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });
    console.log("response from applying for job", response?.data);
    return response?.data;
  } catch (error) {
    console.log("error applying for job", error?.response?.data);
    return error?.response?.data;
  }
}

export const get_applications_by_jobs = async (slug) => {
  try {
    const response = await axios.get(`${API_URL}/applications/${slug}`,{
      withCredentials: true,
    });
    console.log("response from getting applications by jobs", response?.data);
    return response?.data;
  } catch (error) {
    console.log("error getting applications by jobs", error?.response?.data);
    return error?.response?.data;
  }
}

export const get_all_applications = async () => {
  try {
    const response = await axios.get(`${API_URL}/applications/get-all-applications`,{
      withCredentials: true,
    });
    console.log("response from getting all applications", response?.data);
    return response?.data;
  } catch (error) {
    console.log("error getting all applications", error?.response?.data);
    return error?.response?.data;
  }
}



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
    const res = await axios.get(`${API_URL}/jobs-listing/language`);
    console.log(res);
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

export const get_job_by_slug = async (slug) => {
  const authtoken = localStorage.getItem("authtoken");

  try {
    const response = await axios.get(
      `${API_URL}/jobs-listing/get-job/${slug}`,
      {
        headers: {
          Authorization: `Bearer ${authtoken}`, // ✅ using authtoken
        },
      },
    );

    return response.data.data;
  } catch (error) {
    console.log("Error fetching job by slug:", error);

    return {
      success: false,
      message: error?.response?.data?.message || "Failed to fetch job",
    };
  }
};

export const get_last_company_details = async () => {
  const token = localStorage.getItem("authToken");

  try {
    const response = await axios.get(
      `${API_URL}/jobs-listing/last-company-details`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log("last company details response 👉", response?.data);

    return response?.data;
  } catch (error) {
    console.log("error getting last company details", error?.response?.data);

    return error?.response?.data;
  }
};

export const get_job_benefits = async () => {
  try {
    const response = await axios.get(`${API_URL}/jobs-listing/job-benefit`);

    console.log("job benefits response", response);

    return response.data.data; // ✅ return only data array
  } catch (error) {
    console.log("error getting job benefits", error);
    return error;
  }
};
