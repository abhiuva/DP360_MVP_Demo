import axios from "axios";

// baseURL is already set globally in App.jsx, but we set it here too for safety
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function getToken() {
  // Try common keys you might be using in other pages
  const keys = [
    "token",
    "access_token",
    "authToken",
    "salespulsesaas_token",
    "jwt",
  ];
  for (const k of keys) {
    const val = localStorage.getItem(k);
    if (val) return val.replace(/^"|"$/g, ""); // strip quotes if stored JSON-stringified
  }
  return null;
}

const api = axios.create({
  baseURL,
  withCredentials: true, // send cookies
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
});

// Attach bearer token if available
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optional: central 401 handling (don’t loop if already at /login)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      // Let the UI render (Employees page won’t crash); you can also navigate to /login if desired
      // window.location.pathname !== "/login" && (window.location.href = "/login");
    }
    return Promise.reject(err);
  }
);

export default api;
