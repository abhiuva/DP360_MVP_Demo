import { API_IMAGES_BASE_URL } from "../config/config";

export function getImageURL(path) {
  if (!path || typeof path !== "string") return "";
  return `${API_IMAGES_BASE_URL}/${path.replace(/^\/+/, "")}`;
}
