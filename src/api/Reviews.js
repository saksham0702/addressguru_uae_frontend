import axios from "axios";
import { API_URL } from "@/services/constants"


export const getReviews = async (SLUG) => {
  const token = localStorage.getItem("authToken");
  try {
    const response = await axios.get(
      `${API_URL}/business/${SLUG}/reviews`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response?.data;
  } catch (error) {
    console.log("Error fetching reviews:", error);
  }
}