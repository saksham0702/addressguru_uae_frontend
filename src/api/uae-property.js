// import axios from "axios";

// const API_URL = "https://addressguru.ae/api";

// export const add_property_listing = async ({
//   payload,
//   step,
//   slug, // ✅ use slug now
// }) => {
//   try {
//     let url = "";
//     let method = "post";

//     if (step === 1) {
//       url = `${API_URL}/property-listings/create-listing/step/${step}`;
//       method = "post";
//     } else {
//       if (!slug) {
//         throw new Error("Slug is required for update steps");
//       }

//       url = `${API_URL}/property-listings/update-listing/${slug}/step/${step}`;
//       method = "put";
//     }

//     const response = await axios({
//       method,
//       url,
//       data: payload,
//       headers: {
//         "Content-Type": "multipart/form-data",
//         Accept: "application/json",
//       },
//     });

//     return response.data;
//   } catch (error) {
//     console.log("Property listing API error:", error);

//     return {
//       success: false,
//       message: error?.response?.data?.message || "Something went wrong",
//       errors: error?.response?.data?.errors || null,
//     };
//   }
// };

import axios from "axios";

const API_URL = "https://addressguru.ae/api";

export const add_property_listing = async ({ payload, step, slug }) => {
  try {
    let url = "";
    let method = "post";
    const token = localStorage.getItem(`authToken`);
    if (step === 1) {
      url = `${API_URL}/property-listings/create-listing/step/${step}`;
      method = "post";
    } else {
      if (!slug) {
        throw new Error("Slug is required for update steps");
      }

      url = `${API_URL}/property-listings/update-listing/${slug}/step/${step}`;
      method = "put";
    }

    const response = await axios({
      method,
      url,
      data: payload,
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        Authorization: `Bearer ${token}`, // ✅ bearer token added
      },
    });

    return response.data;
  } catch (error) {
    console.log("Property listing API error:", error);

    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong",
      errors: error?.response?.data?.errors || null,
    };
  }
};
