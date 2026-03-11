import axios from "axios";

// const API_URL = "http://192.168.29.191:5001/api";
const API_URL = "https://addressguru.ae/api";

// const API_URL = "http://192.168.31.109:5001/api";

export const loginUser = async (payload) => {
  try {
    const response = await axios.post(`${API_URL}/user/login`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    console.log("login response:", response.data);
    return response;
  } catch (err) {
    console.log("login api error", err?.response?.data || err.message);
    throw err;
  }
};

export const logoutUser = async () => {
  const token = localStorage.getItem("token");

  return axios.post(
    `${API_URL}/user/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    },
  );
};
