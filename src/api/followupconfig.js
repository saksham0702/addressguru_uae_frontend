import axios from "axios";

// const API_URL = "http://192.168.31.107:5001";
const API_URL = "https://addressguru.ae/api";


export const getFollowupConfig = async (module, token) => {
  try {
    const response = await axios.get(`${API_URL}/followup-config/${module}`, {
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
export const createFollowupOption = async (module, payload, token) => {
  const res = await axios.post(
    `${API_URL}/followup-config/${module}/option`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data;
};

// ✅ Update Option
export const updateFollowupOption = async (
  module,
  optionId,
  payload,
  token,
) => {
  const res = await axios.put(
    `${API_URL}/followup-config/${module}/option/${optionId}`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data;
};
