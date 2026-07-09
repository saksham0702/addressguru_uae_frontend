// api/broken-links.js
import axios from "axios";
import { API_URL } from "@/services/constants";

export const getBrokenLinks = async () => {
  try {
    const response = await axios.get(`${API_URL}/broken-links`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    return response?.data;
  } catch (error) {
    console.log("error getting broken links", error);
    return error;
  }
};

export const triggerBrokenLinkScan = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/broken-links/scan`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );
    return response?.data;
  } catch (error) {
    console.log("error triggering scan", error);
    return error;
  }
};

export const getScanStatus = async () => {
  try {
    const response = await axios.get(`${API_URL}/broken-links/status`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    return response?.data;
  } catch (error) {
    console.log("error getting scan status", error);
    return error;
  }
};
