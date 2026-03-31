import axios from "axios";

const API_URL = "https://addressguru.ae/api";
// const API_URL = "http://192.168.31.108:5001";

export const get_marketplace_category = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/categories/get-categories-by-type/marketplace`,
    );

    return response?.data?.data;
  } catch (error) {
    console.log("error getting job categories", error);
    return error;
  }
};

export const get_all_marketplace_listings = async (params) => {
  try {
    const response = await axios.get(
      `${API_URL}/marketplace/get-all-listings`,
      {
        params, // ✅ dynamic query params
      },
    );

    console.log("response of marketplace listings", response);
    return response?.data;
  } catch (error) {
    console.log("error getting marketplace listings", error);
    return error?.response?.data;
  }
};

// export const add_marketplace_listing = async ({ payload, step, slug }) => {
//   try {
//     let response;

//     if (step === 1) {
//       // CREATE LISTING
//       response = await axios.post(
//         `${API_URL}/marketplace/create-listing/step/${step}`,
//         payload,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Accept: "application/json",
//           },
//         },
//       );
//     } else {
//       // UPDATE LISTING
//       response = await axios.put(
//         `${API_URL}/marketplace/update-listing/${slug}/step/${step}`,
//         payload,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Accept: "application/json",
//           },
//         },
//       );
//     }

//     return response.data;
//   } catch (error) {
//     return error?.response?.data;
//   }
// };

export const add_marketplace_listing = async ({
  payload,
  step,
  slug,
  listingId,
}) => {
  try {
    const token = localStorage.getItem("authToken");
    let response;

    const isEdit = !!listingId || !!slug;

    if (isEdit) {
      // ✅ UPDATE FLOW
      response = await axios.put(
        `${API_URL}/marketplace/update-listing/${slug}/step/${step}`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } else {
      // ✅ CREATE FLOW
      response = await axios.post(
        `${API_URL}/marketplace/create-listing/step/${step}`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
    }

    return response.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const get_marketplace_by_slug = async (ID) => {
  try {
    const response = await axios.get(
      `${API_URL}/marketplace/get-listing-by-slug/${ID}`,
    );
    return response?.data;
  } catch (error) {
    return null;
  }
};

export const get_all_marketplace = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/marketplace/get-all-listings?page=1&limit=10`,
    );
    return response?.data;
  } catch (error) {
    return null;
  }
};

export const reject_marketplace_listing = (id, data) => {
  const token = localStorage.getItem("token"); // 👈 get token

  return axios.put(`${API_URL}/marketplace/${id}/status`, data, {
    headers: {
      Authorization: `Bearer ${token}`, // 👈 attach token
    },
  });
};

export const approve_marketplace_listing = (id) => {
  const token = localStorage.getItem("token");

  return axios.put(
    `${API_URL}/marketplace/${id}/status`,
    { 
      status: "approved",
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};
