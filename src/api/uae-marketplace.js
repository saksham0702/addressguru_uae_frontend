// import axios from "axios";

// const API_URL = "https://addressguru.ae/api";

// export const get_marketplace_category = async () => {
//   try {
//     const response = await axios.get(
//       `${API_URL}/categories/get-categories-by-type/marketplace`,
//     );
//     console.log("response of marktet place categories", response);

//     return response.data.data;
//   } catch (error) {
//     console.log("error getting job categories", error);
//     return error;
//   }
// };

// export const add_marketplace_listing = async (payload) => {
//   try {
//     console.log("payload of listing", payload);

//     const response = await axios.post(
//       `${API_URL}/marketplace/create-listing`,
//       payload,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//       },
//     );

//     console.log("res of add marketplace listing", response.data);

//     return response.data;
//   } catch (error) {
//     console.log("error of adding marketplace listing", error);

//     return {
//       success: false,
//       errors: error || {},
//       message: error || "Something went wrong",
//     };
//   }
// };

import axios from "axios";

const API_URL = "https://addressguru.ae/api";
// const API_URL = "http://192.168.31.107:5001";

export const get_marketplace_category = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/categories/get-categories-by-type/marketplace`,
    );
    console.log("response of marktet place categories", response);

    return response.data.data;
  } catch (error) {
    console.log("error getting job categories", error);
    return error;
  }
};

export const add_marketplace_listing = async ({ payload, step, slug }) => {
  try {
    let response;

    if (step === 1) {
      // CREATE LISTING
      response = await axios.post(
        `${API_URL}/marketplace/create-listing`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );
    } else {
      // UPDATE LISTING
      response = await axios.put(
        `${API_URL}/marketplace/update-listing/${slug}/step/${step}`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        },
      );
    }

    return response.data;
  } catch (error) {
    return error?.response?.data;
  }
};
