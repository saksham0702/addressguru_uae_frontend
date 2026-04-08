import axios from "axios";

// const API_URL = "http://192.168.31.107:5001";
const API_URL = "https://addressguru.ae/api";


export const add_listings = async (payload, step, slug, listingId) => {
  const token = localStorage.getItem("authToken");

  try {
    let url = "";
    let method = "post";

    const isEditMode = !!(listingId || slug);

    // ✅ STEP 1
    if (step === 1) {
      if (isEditMode) {
        // 👉 UPDATE instead of CREATE
        url = `${API_URL}/business-listing/update-listing/${slug}/step/1`;
        method = "put";
      } else {
        // 👉 CREATE
        url = `${API_URL}/business-listing/create-listing/step/1`;
        method = "post";
      }
    }
    // ✅ STEP 2+
    else {
      url = `${API_URL}/business-listing/update-listing/${slug}/step/${step}`;
      method = "put";
    }

    const response = await axios({
      method,
      url,
      data: payload,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    return response;
  } catch (error) {
    console.log("API ERROR:", error?.response);
    return error.response?.data;
  }
};

export const get_listing_data = async (SLUG) => {
  try {
    const response = await axios.get(
      `${API_URL}/business-listing/get-listing-by-slug/${SLUG}`,
    );
    // console.log("response of single listing", response?.data);
    return response;
  } catch (error) {
    return null;
  }
};

export const get_all_listings = async (SLUG) => {
  try {
    const response = await axios.get(
      `${API_URL}/business-listing/get-all-listings/`,
    );
    // console.log("response of single listing", response?.data);
    return response.data;
  } catch (error) {
    return null;
  }
};

// get single listing  for landing page

export const get_listing_by_businessslug = async (SLUG) => {
  try {
    const response = await axios.get(`${API_URL}/listing/${SLUG}`);
    // console.log("response of single listing", response?.data);
    return response?.data?.data;
  } catch (error) {
    return null;
  }
};

export const reject_listing = (id, data) => {
  const token = localStorage.getItem("token"); // 👈 get token

  return axios.put(`${API_URL}/business-listing/${id}/status`, data, {
    headers: {
      Authorization: `Bearer ${token}`, // 👈 attach token
    },
  });
};

export const approve_listing = (id) => {
  const token = localStorage.getItem("token");

  return axios.put(
    `${API_URL}/business-listing/${id}/status`,
    {
      status: "approved", // ✅ IMPORTANT
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const get_listings_by_category_and_city = async (
  category_slug,
  city_slug,
) => {
  try {
    const response = await axios.get(
      `${API_URL}/business-listing/get-listing-by-category-and-city/${category_slug}/${city_slug}`,
    );

    console.log("response of category + city listings", response?.data);

    return response;
  } catch (error) {
    console.log("Error fetching listings:", error);
  }
};

export const get_approved_listings = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/business-listing/get-approved-listings`,
    );

    console.log("approved listings response", response?.data);

    return response;
  } catch (error) {
    console.error("Error fetching approved listings:", error);
    return null;
  }
};

export const get_all_admin_listings = async ({
  page = 1,
  limit = 10,
  status = "pending",
} = {}) => {
  try {
    const response = await axios.get(
      `${API_URL}/business-listing/get-all-listings`,
      {
        params: {
          page,
          limit,
          status,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching listings:", error);
    return null;
  }
};
