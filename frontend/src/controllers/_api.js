import axios from "axios";

const baseURL =
  import.meta.env?.VITE_API_BASE_URL ||
  window?.ENV?.API_BASE_URL ||
  "/api/v1"; 

const api = axios.create({
  baseURL,
  withCredentials: true, // send cookies for auth
  headers: { "Content-Type": "application/json" },
});


api.interceptors.request.use((config) => {
  try {
    // If you also use JWT token:
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("token");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }


    const keys = ["user", "store_settings", "storeSettings", "tenant_settings", "tenantSettings"];
    for (const k of keys) {
      const raw = localStorage.getItem(k);
      if (!raw) continue;
      const obj = JSON.parse(raw);
      const tid =
        obj?.tenant_id ??
        obj?.tenantId ??
        obj?.user?.tenant_id ??
        obj?.user?.tenantId ??
        obj?.data?.tenant_id ??
        obj?.data?.tenantId ??
        null;
      if (tid) {
        config.headers["X-Tenant-Id"] = String(tid);
        break;
      }
    }
  } catch {}
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {

    if (err?.response?.status === 401 && !/\/login$/i.test(window.location.pathname)) {

    }
    throw err;
  }
);

export default api;
