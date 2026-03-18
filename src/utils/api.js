import axios from "axios";

const API_URL = "https://addressguru.ae/api";

let globalErrorHandler;

export const setErrorHandler = (handler) => {
  globalErrorHandler = handler;
};

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (globalErrorHandler) {
      globalErrorHandler(error);
    }
    return Promise.reject(error);
  },
);

export default api;
