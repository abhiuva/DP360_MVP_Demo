const KEY = "salespulsesaas_user";
const ACCESS_TOKEN_KEY = "salespulsesaas_access_token";
const LEGACY_TOKEN_KEYS = ["token", "access_token", "authToken", "salespulsesaas_token", "jwt"];

export function saveUserDetailsInLocalStorage(user) {
    localStorage.setItem(KEY, JSON.stringify(user));
}

export function saveAuthSessionInLocalStorage({ user, accessToken }) {
    if (user) {
        saveUserDetailsInLocalStorage(user);
    }

    if (accessToken) {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem("token", accessToken);
    }
}

export function getUserDetailsInLocalStorage() {
    const userStr = localStorage.getItem(KEY);
    if (!userStr) return null;

    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
}

export function getAccessTokenInLocalStorage() {
    return (
        localStorage.getItem(ACCESS_TOKEN_KEY) ||
        LEGACY_TOKEN_KEYS.map((key) => localStorage.getItem(key)).find(Boolean) ||
        null
    );
}

export function clearUserDetailsInLocalStorage() {
    localStorage.removeItem(KEY);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    LEGACY_TOKEN_KEYS.forEach((key) => localStorage.removeItem(key));
}

export function isAuthSessionAvailable() {
    return Boolean(getUserDetailsInLocalStorage() && getAccessTokenInLocalStorage());
}
