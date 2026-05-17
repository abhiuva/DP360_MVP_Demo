import axios from "axios";

/**
 * Normalize backend base and add /api/v1 exactly once.
 * Works whether VITE_BACKEND is:
 *  - http://localhost:3000
 *  - http://localhost:3000/api
 *  - http://localhost:3000/api/v1
 */
const ENV_BACKEND =
  import.meta.env.VITE_BACKEND || import.meta.env.VITE_API_URL || "http://localhost:3000";

const trimEnd = (s) => (s || "").replace(/\/+$/, "");
const stripApiSuffix = (u) => trimEnd(u).replace(/\/api(?:\/v\d+)?$/i, "");

const ROOT = stripApiSuffix(ENV_BACKEND);      // -> http://localhost:3000
const API_V1 = `${ROOT}/api/v1`;               // -> http://localhost:3000/api/v1
const SALES_BASE = `${API_V1}/reports/sales`;  // -> http://localhost:3000/api/v1/reports/sales
const SETTINGS_BASE_URL = API_V1;              // -> http://localhost:3000/api/v1

// axios instance that always sends cookies
const http = axios.create({ withCredentials: true });

// helper to add tenant to any filter object
const withTenant = (tenantId, filters = {}) => ({ tenant_id: tenantId, ...filters });

// 🔧 Legacy aliases so existing calls keep working
const API_BASE_URL = SALES_BASE;
const buildParams = withTenant;

/* ------------------- Sales dashboard APIs ------------------- */

export const getSalesSummary = async (tenantId, filters = {}) => {
  const { data } = await http.get(`${SALES_BASE}/sales-summary`, {
    params: withTenant(tenantId, filters),
  });
  return data;
};

export const getSalesByDay = async (tenantId, filters = {}) => {
  const res = await http.get(`${API_BASE_URL}/sales-by-day`, {
    params: buildParams(tenantId, filters),
  });
  return res.data;
};

export const getTopItems = async (tenantId, filters = {}) => {
  const res = await http.get(`${API_BASE_URL}/top-items`, {
    params: buildParams(tenantId, filters),
  });
  return res.data;
};

export const getStockByCategory = async (tenantId, filters = {}) => {
  const res = await http.get(`${API_BASE_URL}/stock-by-category`, {
    params: buildParams(tenantId, filters),
  });
  return res.data;
};

export const getAverageOrderValue = async (tenantId, filters = {}) => {
  const res = await http.get(`${API_BASE_URL}/average-order-value`, {
    params: buildParams(tenantId, filters),
  });
  return res.data;
};

export const getMonthlyTransactions = async (tenantId, filters = {}) => {
  const res = await http.get(`${API_BASE_URL}/monthly-transactions`, {
    params: buildParams(tenantId, filters),
  });
  return Array.isArray(res.data) ? res.data : [res.data];
};

export const getMonthlyRevenueStats = async (tenantId, filters = {}) => {
  const res = await http.get(`${API_BASE_URL}/monthly-revenue`, {
    params: buildParams(tenantId, filters),
  });
  return Array.isArray(res.data) ? res.data : [res.data];
};

export const getSalesByCategory = async (tenantId, filters = {}) => {
  const res = await http.get(`${API_BASE_URL}/sales-by-category`, {
    params: buildParams(tenantId, filters),
  });
  return Array.isArray(res.data) ? res.data : [res.data];
};

export const getSalesByPaymentMode = async (tenantId, filters = {}) => {
  const res = await http.get(`${API_BASE_URL}/sales-by-payment-mode`, {
    params: buildParams(tenantId, filters),
  });
  return Array.isArray(res.data) ? res.data : [res.data];
};

export const getSalesPerHour = async (tenantId, filters = {}) => {
  const res = await http.get(`${API_BASE_URL}/sales-per-hour`, {
    params: buildParams(tenantId, filters),
  });
  return Array.isArray(res.data) ? res.data : [res.data];
};

/* ------------------- Settings (used by dashboard) ------------------- */

export const getStoreDetails = async (tenantId) => {
  const res = await http.get(`${SETTINGS_BASE_URL}/settings/store-details`, {
    headers: { "tenant-id": tenantId },
  });
  return res.data;
};


