const trimTrailingSlash = (value = "") => value.replace(/\/+$/, "");

export const API_ROOT = trimTrailingSlash(
  import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_BACKEND_STORE ||
    (typeof window !== "undefined" ? window.location.origin : "")
);

export const API_BASE = `${API_ROOT}/api`;
