import axios from "axios";

// const API_URL = "https://addressguru.ae/api";

const API_URL = "http://192.168.31.107:5001";

export const get_user_listings = async (type) => {
  const token = localStorage.getItem("authToken");
  //   const userId = localStorage.getItem("userId");
  try {
    const response = await axios.get(
      `${API_URL}/business-listing/get-listing-by-user`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log("i am user listings ", response?.data);
    return response?.data?.data;
  } catch (error) {
    console.log("Error fetching user listings:", error);
  }
};

export const get_job_listings = async (type) => {
  const token = localStorage.getItem("authToken");
  //   const userId = localStorage.getItem("userId");
  try {
    const response = await axios.get(
      `${API_URL}/job-listings/get-listing-by-user`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log("i am user listings ", response?.data);
    return response?.data?.data;
  } catch (error) {
    console.log("Error fetching user listings:", error);
  }
};

export const get_property_listings = async (type) => {
  const token = localStorage.getItem("authToken");
  //   const userId = localStorage.getItem("userId");
  try {
    const response = await axios.get(
      `${API_URL}/property-listings/get-property-by-user`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log("i am user listings ", response?.data);
    return response?.data?.data;
  } catch (error) {
    console.log("Error fetching user listings:", error);
  }
};

export const get_marketplace_listings = async (type) => {
  const token = localStorage.getItem("authToken");
  //   const userId = localStorage.getItem("userId");
  try {
    const response = await axios.get(
      `${API_URL}/marketplace/get-marketplace-by-user`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log("i am user listings ", response?.data);
    return response?.data?.data;
  } catch (error) {
    console.log("Error fetching user listings:", error);
  }
};
