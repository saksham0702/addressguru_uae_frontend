import axios from "axios";
import { API_URL } from "@/services/constants";

export const get_dashboard_data = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const res = await axios.get(`${API_URL}/user/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log("res of dashboard", res?.data);
    return res?.data;
  } catch (error) {
    console.log("error", error);
  }
};

export const get_user_details = async () => {
  try {
    const token = localStorage.getItem(`authToken`);

    const res = await axios.get(`${API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log("res of user", res?.data);
    return res.data; // ✅ FIXED
  } catch (error) {
    console.log("error of getting user", error);
    return null; // optional but better
  }
};
