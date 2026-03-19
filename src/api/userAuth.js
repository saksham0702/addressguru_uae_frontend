import axios from "axios";
import { API_URL } from "@/services/constants";

export const user_login = async (postdata) => {
  try {
    const response = await axios.post(`${API_URL}/login`, postdata);
    return response?.data;
  } catch (error) {
    console.log(error?.response?.data);
    return error?.response?.data || { status: 500, error: "Server error" };
  }
};

export const user_register = async (postdata) => {
  try {
    const response = await axios.post(`${API_URL}/register`, postdata);
    return response?.data;
  } catch (error) {
    // console.log("error is this", error?.response?.data);
    return error?.response?.data?.message;
  }
};

export const verify_otp = async (ID, postdata) => {
  const payLoad = {
    otp: postdata,
  };
  try {
    const response = await axios.post(`${API_URL}/verify-otp`, payLoad);
    return response?.data;
  } catch (error) {
    // console.log("error", error);
    return error?.response?.data?.message;
  }
};

export const resend_otp = async (ID) => {
  try {
    const response = await axios.get(`${API_URL}/request-otp/${ID}`);
    return response?.data;
  } catch (error) {
    console.log("error", error);
    return error?.response?.data?.message;
  }
};

export const forgot_password = async (payload) => {
  try {
    const response = await axios.post(`${API_URL}/password/forgot`, payload);
  } catch (error) {
    return error;
  }
};

export const user_google_login = async (postdata) => {
  try {
    const response = await axios.get(`${API_URL}/google/redirect`);
    console.log("res of get google", response);
    return response?.data;
  } catch (error) {
    console.log(error?.response?.data);
    return error?.response?.data || { status: 500, error: "Server error" };
  }
};

export const social_login = async (postdata) => {
  try {
    const res = await axios.post(`${API_URL}/social-login`, postdata);
    // console.log("social response",res);
    return res?.data;
  } catch (error) {
    console.log("error of social", error);
  }
};
