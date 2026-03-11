import axios from "axios";
import { API_URL } from "@/services/constants";

export const searchData = async (slug, city) => {
  try {
    const url = `${API_URL}/global-search`;

    const payload = {
      search: slug,
      city: city,
    };

    const res = await axios.post(url, payload);
    return res.data;
  } catch (error) {
    console.log("error in search data api", error);
    throw error;
  }
};
