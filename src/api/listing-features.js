// services/dashboardApi.js
import axios from "axios";
import { API_URL } from "@/services/constants";

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
});

export const getMyReviews = async () => {
  const res = await axios.get(`${API_URL}/my-reviews`, {
    headers: getAuthHeader(),
  });
  return res.data.data;
};

export const getMyClaims = async () => {
  const res = await axios.get(`${API_URL}/my-claims`, {
    headers: getAuthHeader(),
  });
  return res?.data;
};

export const getMyReports = async () => {
  const res = await axios.get(`${API_URL}/my-reports`, {
    headers: getAuthHeader(),
  });
  return res.data.data;
};