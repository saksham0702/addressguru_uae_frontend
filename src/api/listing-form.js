import axios from "axios";

// const API_URL = "http://192.168.31.109:5001/api";
const API_URL = "https://addressguru.ae/api";

export const add_listings = async (payload, step) => {
  const token = localStorage.getItem("authToken");
  console.log("payload of listing", payload);
  // console.log("token", token);
  try {
    const response = await axios.post(
      `${API_URL}/business-listing/save-listing/${step}`,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );
    // console.log("res of add listing", response);
    return response;
  } catch (error) {
    console.log("error of adding listing", error?.response);
    return error.response.data;
  }
};
