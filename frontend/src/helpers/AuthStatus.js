import { getAccessTokenInLocalStorage, getUserDetailsInLocalStorage } from "./UserDetails";

export function isSalesUserAuthenticated() {
    const user = getUserDetailsInLocalStorage();
    const token = getAccessTokenInLocalStorage();
    const cookieAuthenticated = document.cookie.includes("salespulsesaas__authenticated=");
    const salesAuthenticated = Boolean(user && (token || cookieAuthenticated));

    console.debug("[auth] auth status", {
        hasUser: Boolean(user),
        hasToken: Boolean(token),
        hasReadableCookie: cookieAuthenticated,
        authenticated: salesAuthenticated,
    });

    return salesAuthenticated;
}
