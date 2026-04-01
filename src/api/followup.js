import axios from "axios";

// const API_URL = "http://192.168.31.107:5001";
const API_URL = "https://addressguru.ae/api";


export const createFollowupLog = async (payload, token,module) => {
  try {
    const response = await axios.post(`${API_URL}/follow-ups?module=${module}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating follow-up log:", error?.response || error);
    throw error?.response?.data || error;
  }
};

export const getFollowupLogs = async (listingId, token,module) => {
  console.log("module",module)
  try {
    const response = await axios.get(
      `${API_URL}/follow-ups/listing/${listingId}?module=${module}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching follow-up logs:", error?.response || error);
    throw error?.response?.data || error;
  }
};
