import axios from "axios";
import { API_URL } from "@/services/constants"
// const API_URL = "http://192.168.31.107:5001";

export const get_user_listings = async (type) => {
  const token = localStorage.getItem("authToken");
  //   const userId = localStorage.getItem("userId");
  try {
    const response = await axios.get(
      `${API_URL}/business-listing/get-listing-by-user?page=1&limit=10`,
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
      `${API_URL}/jobs-listing/get-jobs-by-user`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log("i am user jobs listings ", response?.data);
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


export const get_my_leads = async (listingId) => {
  const token = localStorage.getItem("authToken");
  try {
    const response = await axios.get(
      `${API_URL}/my-leads?category=business&listingId=${listingId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log("i am user leads ", response?.data);
    return response?.data;
  } catch (error) {
    console.log("Error fetching user leads:", error);
  }
}


export const unpublish_listing = async (listingId,type) => {
  const token = localStorage.getItem("authToken");
  try {
    const response = await axios.patch(
      `${API_URL}/business-listing/${listingId}/${type}`,
      { listingId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log("i am user listings ", response?.data);
    return response?.data;
  } catch (error) {
    console.log("Error fetching user listings:", error);
  }
}

export const delete_listing = async (listingId) => {
  const token = localStorage.getItem("authToken");
  try {
    const response = await axios.delete(
      `${API_URL}/business-listing/delete-listing/${listingId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log("i am user listings ", response?.data);
    return response?.data;
  } catch (error) {
    console.log("Error fetching user listings:", error);
  }
}