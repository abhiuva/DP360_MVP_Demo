export function isSalesUserAuthenticated() {
    console.log('cokkeee ', document.cookie);
    
    const salesAuthenticated = document.cookie.includes("salespulsesaas__authenticated=");
    return salesAuthenticated;
}