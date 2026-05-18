const trimTrailingSlash = (value = "") => value.replace(/\/+$/, "");
const stripApiSuffix = (value = "") =>
  trimTrailingSlash(value).replace(/\/api(?:\/v\d+)?$/i, "");

const envApiUrl = import.meta.env.VITE_API_URL;
const runtimeOrigin =
  typeof window !== "undefined" && window.location?.origin
    ? window.location.origin
    : "";

export const API_ROOT = stripApiSuffix(envApiUrl || runtimeOrigin);
export const API_BASE_URL = `${API_ROOT}/api/v1`;
export const API_IMAGES_ROOT = API_ROOT;
export const SOCKET_BASE_URL = API_ROOT;

export const buildApiUrl = (path = "") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
