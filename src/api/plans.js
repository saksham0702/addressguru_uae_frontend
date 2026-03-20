import axios from "axios";

const API_URL = "http://192.168.31.107:5001";

export const get_plans = async () => {
  try {
    const res = await axios.get(`${API_URL}/plans`);
    return res?.data;
  } catch (error) {
    console.log(error);
    return error; // Optional: return a fallback
  }
};
