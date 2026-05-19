import axios from "axios";
import { API } from "../config/config";
import Cookie from "js-cookie";
import {
  getAccessTokenInLocalStorage,
  getUserDetailsInLocalStorage,
  saveAuthSessionInLocalStorage,
} from "./UserDetails";

const apiClient = axios.create({
  baseURL: API,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    const token = getAccessTokenInLocalStorage();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let retryCounter = 0;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    const user = getUserDetailsInLocalStorage();
    const role = user?.role || "";

    if(status === 402) { // payment required, subscription is not active
      window.location.href = "/dashboard/inactive-subscription"
      return;
    }

    if (
      (status === 401 || status === 403) &&
      originalRequest &&
      !originalRequest._retry &&
      !String(originalRequest.url || "").includes("refresh-token")
    ) {
      originalRequest._retry = true;

      retryCounter+=1;

      if(retryCounter > 3) {
        Cookie.remove("salespulsesaas__authenticated");
        if(role == "superadmin") {
          window.location.href = "/superadmin";
        } else {
          window.location.href = "/login";
        }
        return;
      }

      try {
        const res = role == "superadmin"? await apiClient.post("/superadmin/refresh-token") : await apiClient.post("/auth/refresh-token");

        if(res.status == 401 || res.status == 403) {
          if(role == "superadmin") {
            window.location.href = "/superadmin";
          } else {
            window.location.href = "/login";
          }
          return;
        }
        if (res?.data?.accessToken) {
          saveAuthSessionInLocalStorage({
            user,
            accessToken: res.data.accessToken,
          });
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
        }
        retryCounter = 0;
        return apiClient(originalRequest);
      } catch (error) {
        // Handle refresh token error (e.g., redirect to login)
        console.error(error);
        if(role == "superadmin") {
          window.location.href = "/superadmin";
        } else {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    } else {
      return Promise.reject(error);
    }
  }
);

export default apiClient;
