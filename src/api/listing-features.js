// services/dashboardApi.js
import axios from "axios";
import { API_URL } from "@/services/constants";

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
});

export const getMyReviews = async (params) => {
  const res = await axios.get(`${API_URL}/my-reviews`, {
    params,
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

export const updateEnquries = async (id, status) => {
  const res = await axios.patch(`${API_URL}/enquiries/${id}`, {
    status,
    headers: getAuthHeader(),
  });
  return res.data;
};

// admin
export const getAllBusinessEnquiries = async (params) => {
  const res = await axios.get(`${API_URL}/enquiries`, { params });
  return res.data;
};

export const getAllReviewsAdmin = async (params) => {
  const res = await axios.get(`${API_URL}/admin/reviews`, {
    params,
    headers: getAuthHeader(),
  });

  return res.data;
};

export const updateReviewStatus = async (reviewId, status) => {
  const res = await axios.patch(
    `${API_URL}/admin/reviews/${reviewId}`,
    { status },
    {
      headers: getAuthHeader(),
    },
  );

  return res.data;
};

export const getAllClaimsAdmin = async (params) => {
  const res = await axios.get(`${API_URL}/admin/claims`, {
    params,
    headers: getAuthHeader(),
  });
  return res.data;
};

export const transferOwnership = async (claimId) => {
  try {
    const res = await axios.patch(
      `${API_URL}/admin/claims/${claimId}/transfer`,
      {},
      { headers: getAuthHeader() },
    );
    return res.data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      "Failed to transfer ownership. Please try again.";
    throw new Error(message);
  }
};

export const adminReviewClaim = async (claimId, data) => {
  try {
    const res = await axios.patch(`${API_URL}/admin/claims/${claimId}`, data, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      "Failed to review claim. Please try again.";
    throw new Error(message);
  }
};
