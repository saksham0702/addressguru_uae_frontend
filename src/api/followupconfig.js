import axios from "axios";
import { API_URL } from "@/services/constants"
// const API_URL = "http://192.168.31.107:5001";


export const getFollowupConfig = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/followup-config`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching followup config:", error?.response || error);
    throw error?.response?.data || error;
  }
};

// ✅ Create Option
export const createFollowupOption = async (payload, token) => {
  const res = await axios.post(
    `${API_URL}/followup-config/option`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data;
};

// ✅ Update Option
export const updateFollowupOption = async (
  optionId,
  payload,
  token,
) => {
  const res = await axios.put(
    `${API_URL}/followup-config/option/${optionId}`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data;
};
