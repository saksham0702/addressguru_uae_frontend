import axios from "axios";
import { API_URL } from "@/services/constants"
// const API_URL = "http://192.168.31.104:5001";
// const API_URL = "http://localhost:5001";

// const API_URL = "http://192.168.31.107:5001";

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

export const createUser = async (data) => {
  const res = await axios.post(`${API_URL}/admin/users/create`, data, {
    withCredentials: true,
  });
  return res.data;
};

export const updateUser = async (id, payload) => {
  const res = await axios.patch(
    `${API_URL}/admin/users/update/${id}`, // change if your backend route is different
    payload,
    {
      withCredentials: true,
    },
  );

  return res.data;
};

export const getUsers = async () => {
  const res = await axios.get(`${API_URL}/admin/users/get-all`, {
    withCredentials: true,
  });
  return res.data;
};

export const getUserById = (id) => {
  const res = axios.get(`${API_URL}/admin/users/get-one/${id}`, {
    withCredentials: true,
  });
  return res;
};

export const deleteUser = async (id) => {
  return axios.delete(`${API_URL}/admin/users/delete/${id}`, {
    withCredentials: true,
  });
};

// api/auth.js
export const loginAsUser = async (id) => {
  const response = await axios.post(`${API_URL}/user/user-login/${id}`, {}, {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
    withCredentials: true,
  });
  console.log("login as user response:", response?.data?.data);
  const { authToken, adminBackupToken } = response?.data?.data;
  localStorage.setItem("adminBackupToken", adminBackupToken);
  localStorage.setItem("authToken", authToken);
  return response;
};

// ✅ Add this too — exit impersonation
export const exitLoginAsUser = async () => {
  const backupToken = localStorage.getItem("adminBackupToken");

  const response = await axios.post(
    `${API_URL}/impersonate/exit`,
    null,
    {
      headers: { "x-admin-backup-token": backupToken },
      withCredentials: true,
    }
  );

  const { authToken } = response?.data?.data;

  // ✅ Restore admin token
  localStorage.setItem("authToken", authToken);
  localStorage.removeItem("adminBackupToken");

  return response;
};

export const user_register = async (postdata) => {
  try {
    const response = await axios.post(`${API_URL}/user/register`, postdata, {
      withCredentials: true,
    });
    return response?.data;
  } catch (error) {
    // console.log("error is this", error?.response?.data);
    return error?.response?.data?.message;
  }
};

export const get_user_details = async () => {
  try {
    const token = localStorage.getItem(`authToken`);

    const res = await axios.get(`${API_URL}/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    // console.log("res of user", res?.data);
    return res.data; // ✅ FIXED
  } catch (error) {
    console.log("error of getting user", error);
    return null; // optional but better
  }
};

export const verify_otp = async (postdata) => {
  try {
    const response = await axios.post(`${API_URL}/user/verify-otp`, postdata, {
      withCredentials: true,
    });
    return response?.data;
  } catch (error) {
    // console.log("error", error);
    return error?.response?.data?.message;
  }
};


// admin stats 

export const adminStats = async () => {
  try {
    const res = await axios.get(`${API_URL}/admin/users/statistics`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      withCredentials: true,
    });
    console.log("admin stats response:", res?.data?.data);
    return res?.data?.data;
  } catch (error) {
    console.log("error of getting admin stats", error);
    return null;
  }
};
