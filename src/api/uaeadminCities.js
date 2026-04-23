import axios from "axios";
import { API_URL } from "@/services/constants"

export const getCities = async () => {
  const res = await axios.get(`${API_URL}/cities/get-cities`);
  // console.log("get cities respose", res);

  return res?.data;
};

export const createCity = async (payload) => {
  const res = await axios.post(`${API_URL}/cities/add-cities`, {
    ...payload,
  });
  return res?.data?.data;
};

export const updateCity = async (id, payload) => {
  const res = await axios.put(`${API_URL}/cities/update-city/${id}`, payload);
  return res.data?.data;
};

export const deleteCity = async (id) => {
  const res = await axios.delete(`${API_URL}/cities/delete-city/${id}`);
  return res?.data?.data;
};
