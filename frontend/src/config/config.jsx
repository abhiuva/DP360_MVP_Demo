import { API_BASE_URL, API_IMAGES_ROOT, SOCKET_BASE_URL } from "./api";

export const API = API_BASE_URL;
export const VITE_BACKEND_SOCKET_IO = SOCKET_BASE_URL;
export const API_IMAGES_BASE_URL = API_IMAGES_ROOT;
export const FRONTEND_DOMAIN =
  import.meta.env.VITE_FRONTEND_DOMAIN ||
  (typeof window !== "undefined" ? window.location.origin : "");

export const iconStroke = 1.5;

export const supportEmail = "info@salespulse.com";
export const appVersion = "1.3.2";

export const subscriptionAmount = 5;
export const subscriptionPrice = "$" + subscriptionAmount;

export const stripeProductSubscriptionId = import.meta.env.VITE_STRIPE_PRODUCT_SUBSCRIPTION_KEY;
export const profilePath = import.meta.env.VITE_PROFILE_IMG_PATH;
